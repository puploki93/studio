#!/bin/bash
# Hardware Serial Number Privacy Tool for macOS
# Shows current exposure and provides privacy recommendations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

print_privacy() {
    echo -e "${PURPLE}[PRIVACY]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script only works on macOS"
    exit 1
fi

# Function to show hardware serials
show_serials() {
    echo ""
    print_info "Hardware Serial Numbers Currently Exposed:"
    echo ""

    # System Serial Number
    local system_serial=$(system_profiler SPHardwareDataType | grep "Serial Number" | awk '{print $4}')
    echo -e "  ${YELLOW}System Serial:${NC} $system_serial"

    # Hardware UUID
    local hardware_uuid=$(system_profiler SPHardwareDataType | grep "Hardware UUID" | awk '{print $3}')
    echo -e "  ${YELLOW}Hardware UUID:${NC} $hardware_uuid"

    # Platform UUID
    local platform_uuid=$(ioreg -rd1 -c IOPlatformExpertDevice | grep "IOPlatformUUID" | awk -F'"' '{print $4}')
    echo -e "  ${YELLOW}Platform UUID:${NC} $platform_uuid"

    echo ""
}

# Function to show what can access serial numbers
show_access_info() {
    echo ""
    print_info "System Commands That Expose Serial Numbers:"
    echo ""
    echo "  1. system_profiler SPHardwareDataType"
    echo "  2. ioreg -l | grep IOPlatformSerialNumber"
    echo "  3. ioreg -rd1 -c IOPlatformExpertDevice"
    echo ""

    print_warning "These commands can be run by any application without special permissions!"
    echo ""
}

# Function to monitor serial number access
monitor_access() {
    print_info "Monitoring system calls for serial number access..."
    print_info "Press Ctrl+C to stop monitoring"
    echo ""

    # Check if fs_usage is available (requires sudo)
    if [[ $EUID -ne 0 ]]; then
        print_error "Monitoring requires sudo privileges"
        echo "Run: sudo $0 monitor"
        exit 1
    fi

    # Monitor file system usage for common serial access patterns
    fs_usage -f filesys | grep -E "(IOPlatform|system_profiler|ioreg)" &
    local fs_pid=$!

    # Also monitor process execution
    print_info "Watching for serial number access attempts..."

    # Trap Ctrl+C to clean up
    trap "kill $fs_pid 2>/dev/null; exit" INT

    wait $fs_pid
}

# Function to show privacy recommendations
show_recommendations() {
    echo ""
    print_privacy "=== PRIVACY RECOMMENDATIONS ==="
    echo ""

    echo "1. ${GREEN}System Preferences Hardening:${NC}"
    echo "   - Disable Analytics & Advertising tracking"
    echo "   - Review apps with Full Disk Access permissions"
    echo "   - Limit diagnostic data sharing"
    echo ""

    echo "2. ${GREEN}Network Privacy:${NC}"
    echo "   - Use MAC address randomization (see mac-spoof.sh)"
    echo "   - Use VPN to hide your IP address"
    echo "   - Disable Bluetooth when not in use"
    echo ""

    echo "3. ${GREEN}Application Permissions:${NC}"
    echo "   - Review System Settings > Privacy & Security"
    echo "   - Revoke unnecessary permissions from apps"
    echo "   - Use App Sandbox when possible"
    echo ""

    echo "4. ${GREEN}Serial Number Exposure Mitigation:${NC}"
    echo "   - Cannot change hardware serial (it's in firmware)"
    echo "   - Can intercept/modify output of query commands"
    echo "   - Monitor which apps access hardware info"
    echo "   - Use virtual machines for untrusted software"
    echo ""

    echo "5. ${GREEN}Advanced Privacy:${NC}"
    echo "   - Use System Integrity Protection (SIP)"
    echo "   - Enable FileVault disk encryption"
    echo "   - Use firmware password"
    echo "   - Regular privacy audits"
    echo ""
}

# Function to create wrapper scripts that hide serial
create_wrappers() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Creating wrappers requires sudo privileges"
        exit 1
    fi

    local wrapper_dir="/usr/local/bin/privacy-wrappers"
    mkdir -p "$wrapper_dir"

    print_info "Creating privacy wrapper scripts in $wrapper_dir"

    # Create system_profiler wrapper
    cat > "$wrapper_dir/system_profiler" << 'EOF'
#!/bin/bash
# Wrapper for system_profiler that redacts serial numbers
output=$(/usr/sbin/system_profiler "$@")
echo "$output" | sed -E 's/(Serial Number[^:]*:)[[:space:]]*[A-Z0-9]+/\1 [REDACTED]/g' | \
                 sed -E 's/(Hardware UUID[^:]*:)[[:space:]]*[A-F0-9-]+/\1 [REDACTED]/g'
EOF

    chmod +x "$wrapper_dir/system_profiler"

    # Create ioreg wrapper
    cat > "$wrapper_dir/ioreg" << 'EOF'
#!/bin/bash
# Wrapper for ioreg that redacts serial numbers
output=$(/usr/sbin/ioreg "$@")
echo "$output" | sed -E 's/(IOPlatformSerialNumber[^"]*")[^"]*"/\1[REDACTED]"/g' | \
                 sed -E 's/(IOPlatformUUID[^"]*")[^"]*"/\1[REDACTED]"/g'
EOF

    chmod +x "$wrapper_dir/ioreg"

    print_success "Wrapper scripts created!"
    echo ""
    print_info "To use wrappers, add to your PATH:"
    echo "  export PATH=\"$wrapper_dir:\$PATH\""
    echo ""
    print_warning "Note: This only affects CLI usage. Applications using system APIs directly won't be affected."
}

# Function to remove wrappers
remove_wrappers() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Removing wrappers requires sudo privileges"
        exit 1
    fi

    local wrapper_dir="/usr/local/bin/privacy-wrappers"

    if [[ -d "$wrapper_dir" ]]; then
        rm -rf "$wrapper_dir"
        print_success "Privacy wrappers removed"
    else
        print_info "No wrappers found"
    fi
}

# Function to run privacy audit
run_audit() {
    echo ""
    print_info "=== PRIVACY AUDIT ==="
    echo ""

    # Check system settings
    print_info "Checking system privacy settings..."

    # Check if FileVault is enabled
    if fdesetup status | grep -q "FileVault is On"; then
        print_success "FileVault encryption: ENABLED"
    else
        print_warning "FileVault encryption: DISABLED (consider enabling)"
    fi

    # Check if firewall is enabled
    if /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate | grep -q "enabled"; then
        print_success "Firewall: ENABLED"
    else
        print_warning "Firewall: DISABLED (consider enabling)"
    fi

    # Check SIP status
    if csrutil status | grep -q "enabled"; then
        print_success "System Integrity Protection: ENABLED"
    else
        print_warning "System Integrity Protection: DISABLED"
    fi

    echo ""
    show_serials
    show_access_info
}

# Main command handling
case "${1:-info}" in
    info)
        show_serials
        show_access_info
        show_recommendations
        ;;

    show)
        show_serials
        ;;

    monitor)
        monitor_access
        ;;

    recommendations|tips)
        show_recommendations
        ;;

    create-wrappers)
        create_wrappers
        ;;

    remove-wrappers)
        remove_wrappers
        ;;

    audit)
        run_audit
        ;;

    help|--help|-h)
        echo "Mac Privacy Tool - Hardware Serial Number Privacy Utility"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  info              Show serial numbers and access information (default)"
        echo "  show              Display hardware serial numbers"
        echo "  monitor           Monitor serial number access (requires sudo)"
        echo "  recommendations   Show privacy recommendations"
        echo "  create-wrappers   Create CLI wrapper scripts to redact serials (requires sudo)"
        echo "  remove-wrappers   Remove privacy wrapper scripts (requires sudo)"
        echo "  audit             Run comprehensive privacy audit"
        echo "  help              Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 info"
        echo "  $0 show"
        echo "  sudo $0 monitor"
        echo "  sudo $0 create-wrappers"
        ;;

    *)
        print_error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
