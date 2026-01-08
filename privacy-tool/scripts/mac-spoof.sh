#!/bin/bash
# MAC Address Spoofing Tool for macOS
# Requires sudo privileges

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script only works on macOS"
    exit 1
fi

# Check if running with sudo
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run with sudo privileges"
   echo "Usage: sudo $0 [command] [interface]"
   exit 1
fi

# Function to get all network interfaces
get_interfaces() {
    networksetup -listallhardwareports | grep -A 1 "Hardware Port" | grep "Device:" | awk '{print $2}'
}

# Function to get current MAC address
get_current_mac() {
    local interface=$1
    ifconfig "$interface" | grep ether | awk '{print $2}'
}

# Function to generate random MAC address
generate_random_mac() {
    # Generate a random MAC with local bit set (first octet even, bit 1 set to 1)
    # This ensures it's recognized as locally administered
    printf '02:%02x:%02x:%02x:%02x:%02x\n' $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256))
}

# Function to change MAC address
change_mac() {
    local interface=$1
    local new_mac=$2

    print_info "Disabling interface $interface..."
    ifconfig "$interface" down

    print_info "Changing MAC address to $new_mac..."
    ifconfig "$interface" ether "$new_mac"

    print_info "Re-enabling interface $interface..."
    ifconfig "$interface" up

    sleep 2

    local current_mac=$(get_current_mac "$interface")
    if [[ "$current_mac" == "$new_mac" ]]; then
        print_success "MAC address successfully changed to $new_mac"
    else
        print_warning "MAC address change may not have persisted. Current: $current_mac"
    fi
}

# Function to restore original MAC address
restore_mac() {
    local interface=$1

    print_info "Restoring original MAC address for $interface..."

    # Cycle the interface to restore hardware MAC
    ifconfig "$interface" down
    sleep 1
    ifconfig "$interface" up

    sleep 2

    local current_mac=$(get_current_mac "$interface")
    print_success "MAC address restored to: $current_mac"
}

# Function to show current status
show_status() {
    print_info "Network Interfaces and MAC Addresses:"
    echo ""

    for interface in $(get_interfaces); do
        if ifconfig "$interface" &>/dev/null; then
            local mac=$(get_current_mac "$interface")
            local status=$(ifconfig "$interface" | grep "status:" | awk '{print $2}')
            echo -e "  ${GREEN}$interface${NC}"
            echo -e "    MAC Address: ${BLUE}$mac${NC}"
            echo -e "    Status: $status"
            echo ""
        fi
    done
}

# Main command handling
case "${1:-status}" in
    status)
        show_status
        ;;

    randomize)
        if [[ -z "$2" ]]; then
            print_error "Please specify an interface"
            echo "Available interfaces:"
            get_interfaces
            exit 1
        fi

        interface=$2
        new_mac=$(generate_random_mac)

        print_info "Randomizing MAC address for $interface"
        change_mac "$interface" "$new_mac"
        ;;

    change)
        if [[ -z "$2" ]] || [[ -z "$3" ]]; then
            print_error "Please specify interface and MAC address"
            echo "Usage: sudo $0 change <interface> <mac_address>"
            exit 1
        fi

        interface=$2
        new_mac=$3

        # Validate MAC address format
        if [[ ! "$new_mac" =~ ^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$ ]]; then
            print_error "Invalid MAC address format. Use format: XX:XX:XX:XX:XX:XX"
            exit 1
        fi

        change_mac "$interface" "$new_mac"
        ;;

    restore)
        if [[ -z "$2" ]]; then
            print_error "Please specify an interface"
            echo "Available interfaces:"
            get_interfaces
            exit 1
        fi

        interface=$2
        restore_mac "$interface"
        ;;

    list)
        print_info "Available network interfaces:"
        get_interfaces
        ;;

    help|--help|-h)
        echo "Mac Privacy Tool - MAC Address Spoofing Utility"
        echo ""
        echo "Usage: sudo $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  status              Show all network interfaces and their MAC addresses (default)"
        echo "  randomize <iface>   Generate and apply a random MAC address to interface"
        echo "  change <iface> <mac> Change MAC address to specified value"
        echo "  restore <iface>     Restore original hardware MAC address"
        echo "  list                List all available network interfaces"
        echo "  help                Show this help message"
        echo ""
        echo "Examples:"
        echo "  sudo $0 status"
        echo "  sudo $0 randomize en0"
        echo "  sudo $0 change en0 02:aa:bb:cc:dd:ee"
        echo "  sudo $0 restore en0"
        ;;

    *)
        print_error "Unknown command: $1"
        echo "Run 'sudo $0 help' for usage information"
        exit 1
        ;;
esac
