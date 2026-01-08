# Mac Privacy Tool

A comprehensive privacy utility for macOS that helps protect your MAC address and hardware serial number from unwanted exposure.

## 🔒 Features

### MAC Address Privacy
- **View** all network interfaces and their MAC addresses
- **Randomize** MAC address with cryptographically random values
- **Change** MAC address to a specific value
- **Restore** original hardware MAC address
- **List** all available network interfaces

### Hardware Serial Number Privacy
- **Display** current hardware serial numbers and UUIDs
- **Monitor** which processes access your serial number
- **Create wrappers** to redact serial numbers from CLI commands
- **Privacy audit** to check system security settings
- **Recommendations** for enhanced privacy protection

## 📋 Requirements

- macOS (tested on macOS 10.15+)
- Node.js 16.0 or higher
- sudo privileges (for MAC address changes and monitoring)

## 🚀 Installation

### Option 1: Local Installation

```bash
cd privacy-tool
npm install
npm run build
```

### Option 2: Global Installation

```bash
cd privacy-tool
npm install
npm run install-global
```

After global installation, you can use `privacy-tool` from anywhere.

## 📖 Usage

### Main Menu

```bash
privacy-tool
```

Shows the main menu with all available commands.

### MAC Address Commands

#### View Current Status
```bash
privacy-tool mac status
```

Shows all network interfaces with their current MAC addresses and status.

#### Randomize MAC Address
```bash
sudo privacy-tool mac randomize en0
```

Generates a random, locally-administered MAC address and applies it to the specified interface (e.g., `en0` for Wi-Fi).

#### Change to Specific MAC
```bash
sudo privacy-tool mac change en0 02:aa:bb:cc:dd:ee
```

Changes the MAC address to a specific value you provide.

#### Restore Original MAC
```bash
sudo privacy-tool mac restore en0
```

Restores the original hardware MAC address.

#### List Network Interfaces
```bash
privacy-tool mac list
```

Shows all available network interfaces on your system.

### Hardware Serial Privacy Commands

#### Show Serial Information
```bash
privacy-tool serial show
```

Displays your hardware serial number, hardware UUID, and platform UUID.

#### Get Full Privacy Info
```bash
privacy-tool serial info
```

Shows serial numbers, how they can be accessed, and privacy recommendations.

#### Monitor Serial Access
```bash
sudo privacy-tool serial monitor
```

Monitors your system for processes attempting to access hardware serial numbers. Press Ctrl+C to stop.

#### Privacy Recommendations
```bash
privacy-tool serial tips
```

Displays detailed privacy recommendations for protecting your hardware information.

#### Run Privacy Audit
```bash
privacy-tool serial audit
```

Performs a comprehensive privacy audit checking:
- FileVault encryption status
- Firewall status
- System Integrity Protection (SIP)
- Current hardware serials exposure

#### Create Privacy Wrappers
```bash
sudo privacy-tool serial wrappers
```

Creates wrapper scripts for `system_profiler` and `ioreg` commands that redact serial numbers from output.

### Quick Privacy Setup

```bash
sudo privacy-tool quick-privacy
```

Runs a quick privacy setup including an audit of your system.

## 🛡️ Privacy Features Explained

### MAC Address Spoofing

Your MAC address is a unique identifier for your network hardware. It can be used to:
- Track your device across networks
- Identify your device even when using VPN
- Fingerprint your hardware

**How this tool helps:**
- Generates random MAC addresses that appear legitimate
- Allows you to change MAC addresses temporarily
- Easy restoration of original hardware MAC

**Important Notes:**
- MAC changes are temporary and reset on reboot
- Some networks may require whitelisted MACs
- Randomization uses locally-administered address space (first octet = 02)

### Hardware Serial Number Protection

Your hardware serial number is embedded in firmware and cannot be changed, but can be:
- Queried by any application without permission
- Used to track your device across reinstalls
- Linked to your Apple ID and purchase history

**How this tool helps:**
- Shows what's currently exposed
- Monitors which processes access your serial
- Creates wrapper scripts to redact serials from CLI output
- Provides recommendations for limiting exposure

**Limitations:**
- Cannot change the actual hardware serial (it's in firmware)
- Applications using system APIs directly will bypass wrappers
- Best used with virtual machines for untrusted software

## 🔧 Advanced Usage

### Using Privacy Wrappers

After creating wrappers with `sudo privacy-tool serial wrappers`, add them to your PATH:

```bash
echo 'export PATH="/usr/local/bin/privacy-wrappers:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Now commands like `system_profiler` and `ioreg` will automatically redact serial numbers.

### Automated MAC Randomization

You can create a script to randomize your MAC address on boot or network changes using macOS's built-in automation tools.

**Example LaunchAgent** (save to `~/Library/LaunchAgents/com.privacy.macrandomize.plist`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.privacy.macrandomize</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/privacy-tool/scripts/mac-spoof.sh</string>
        <string>randomize</string>
        <string>en0</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

### Network Interface Names

Common macOS network interfaces:
- `en0` - Primary Wi-Fi
- `en1` - Secondary network (may vary)
- `en2` - Thunderbolt/USB Ethernet
- `bridge0` - Bridge interface

Use `privacy-tool mac list` to see all available interfaces on your system.

## 🔐 Security Considerations

### Why Privacy Matters

1. **Device Tracking**: MAC addresses and serial numbers can track you across networks and sessions
2. **Fingerprinting**: Combined with other data, they create unique device fingerprints
3. **Data Brokers**: These identifiers are often collected and sold
4. **Corporate Tracking**: Many retail stores track MAC addresses for customer behavior analysis

### Best Practices

1. **MAC Address**:
   - Randomize when connecting to public Wi-Fi
   - Use different MACs for different networks
   - Restore original MAC for home/work networks that require it

2. **Serial Numbers**:
   - Use wrappers when running unknown scripts
   - Monitor access regularly
   - Use virtual machines for untrusted software

3. **System Security**:
   - Enable FileVault disk encryption
   - Enable firewall
   - Keep System Integrity Protection (SIP) enabled
   - Use firmware password

4. **Network Privacy**:
   - Combine with VPN for IP privacy
   - Disable Bluetooth when not needed
   - Review app permissions regularly

## 🐛 Troubleshooting

### "Permission denied" errors
Make sure to use `sudo` for commands that require it:
```bash
sudo privacy-tool mac randomize en0
```

### MAC address change doesn't persist
MAC address changes are temporary and will reset on:
- System reboot
- Network interface restart
- Network configuration changes

To make changes persistent, you would need to create a LaunchAgent (see Advanced Usage).

### "Unknown interface" error
Check available interfaces with:
```bash
privacy-tool mac list
```

### Scripts not executable
Run:
```bash
chmod +x privacy-tool/scripts/*.sh
```

## 📚 Additional Resources

- [Apple Privacy Policy](https://www.apple.com/privacy/)
- [EFF Privacy Guides](https://www.eff.org/issues/privacy)
- [OWASP Privacy Project](https://owasp.org/www-project-top-10-privacy-risks/)

## ⚖️ Legal Notice

This tool is for **legitimate privacy protection** on your own devices. Users are responsible for:
- Complying with local laws and regulations
- Following network terms of service
- Respecting organization policies on company-owned devices

**Do not use this tool to**:
- Bypass network security on networks you don't own
- Evade bans or restrictions
- Impersonate other devices
- Engage in any illegal activities

## 🤝 Contributing

This is a personal privacy tool. Feel free to modify and enhance it for your own needs.

## 📄 License

MIT License - Use at your own risk. This tool is provided as-is with no warranties.

## 🙏 Acknowledgments

Built for privacy-conscious Mac users who value their right to privacy and want control over their device's identifiable information.

---

**Remember**: Privacy is a right, not a privilege. Stay safe and protect your digital identity! 🔒
