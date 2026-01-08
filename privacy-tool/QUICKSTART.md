# Quick Start Guide - Mac Privacy Tool

Get started with protecting your MAC address and hardware serial number in under 5 minutes!

## 🚀 Installation (2 minutes)

```bash
cd privacy-tool
./install.sh
sudo npm link
```

## ✅ First Steps (3 minutes)

### 1. Check Your Current Privacy Status

```bash
privacy-tool serial audit
```

This shows:
- ✓ FileVault encryption status
- ✓ Firewall status
- ✓ System Integrity Protection
- ✓ Your exposed hardware serials

### 2. View Your Network Interfaces

```bash
privacy-tool mac status
```

This displays all your network interfaces and their current MAC addresses.

### 3. Randomize Your Wi-Fi MAC Address

```bash
sudo privacy-tool mac randomize en0
```

**Note**: Replace `en0` with your actual Wi-Fi interface from step 2.

## 🎯 Common Use Cases

### Going to a Coffee Shop (Public Wi-Fi)

```bash
# Before connecting to public Wi-Fi
sudo privacy-tool mac randomize en0

# After leaving
sudo privacy-tool mac restore en0
```

### Running Unknown Scripts

```bash
# Create privacy wrappers first
sudo privacy-tool serial wrappers

# Add to your PATH
echo 'export PATH="/usr/local/bin/privacy-wrappers:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Now `system_profiler` and `ioreg` will redact your serial numbers.

### Regular Privacy Check

```bash
# Weekly privacy audit
privacy-tool serial audit

# Monitor what's accessing your serial
sudo privacy-tool serial monitor
```

## 📱 Daily Commands

### MAC Address
```bash
privacy-tool mac status          # Check current MAC
sudo privacy-tool mac randomize en0   # Randomize MAC
sudo privacy-tool mac restore en0     # Restore original
```

### Serial Privacy
```bash
privacy-tool serial show         # View your serials
privacy-tool serial tips         # Get privacy tips
privacy-tool serial audit        # Full privacy check
```

## 🛡️ Pro Tips

1. **Public Networks**: Always randomize your MAC on public Wi-Fi
2. **Home Network**: Use your real MAC (may be needed for router)
3. **Virtual Machines**: Use VMs for untrusted software to protect your serial
4. **Regular Audits**: Run `privacy-tool serial audit` weekly

## 🆘 Need Help?

```bash
privacy-tool help                # Show all commands
privacy-tool mac help            # MAC address help
privacy-tool serial help         # Serial privacy help
```

## ⚡ One-Line Quick Privacy

```bash
sudo privacy-tool mac randomize en0 && privacy-tool serial audit
```

Randomizes your MAC and runs a privacy audit in one command!

---

**You're all set!** 🎉 Your Mac mini is now more private. Check the full [README.md](README.md) for advanced features.
