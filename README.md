# Secure Sentinel

Create a clean, modern, professional web-based Intrusion Detection and Prevention System (IDPS) prototype for a college capstone project.

IMPORTANT:
This is an academic demonstration prototype, NOT a real enterprise security system. Do not implement real firewall changes, real IP blocking, real packet sniffing, or anything that could affect the user's actual network. All network traffic and prevention actions must be simulated inside the application.

PROJECT TITLE

INTRUSION PREVENTION AND DETECTION SYSTEM (IDPS)

The prototype should demonstrate this complete workflow:

Simulated Network Traffic → Data Collection → Data Preprocessing → Threat Detection → Alert Generation → Simulated Prevention → Security Logs → Dashboard

The system should clearly demonstrate three project modules:

MODULE 1 – DATA COLLECTION & PREPROCESSING

Generate simulated network traffic.

Collect simulated connection information and security events.

Display:

Source IP

Destination IP

Source Port

Destination Port

Protocol

Packet Size

Connection Frequency

Timestamp

Clean and process the simulated data.

Show the processed traffic in a table.

MODULE 2 – INTRUSION DETECTION & CLASSIFICATION

Use simple predefined security rules to identify suspicious activity.

Detect examples such as:

Normal Traffic

Port Scanning

Brute-Force / Repeated Login Attempts

Abnormal High-Frequency Traffic

Suspicious Connection

Classify each event as:

NORMAL

LOW

MEDIUM

HIGH

CRITICAL

For every detected threat, show:

Threat type

Source IP

Severity

Detection time

Reason for detection

Detection status

MODULE 3 – INTRUSION PREVENTION & RESPONSE

When a suspicious event is detected, provide a simulated prevention action.

Example:

Threat Detected

Threat: Port Scan

Source IP: 192.168.1.105

Severity: HIGH

Prevention Action

Action: IP BLOCKED

Status: SIMULATED

Message: "Suspicious IP has been blocked in the prototype."

IMPORTANT:
Do NOT actually modify firewall settings or network configuration.
The "Block IP" action must only change the application's simulated state.

DESIGN REQUIREMENTS

Create a very clean, professional and modern UI.

The design should look like a simple cybersecurity monitoring dashboard suitable for a college capstone demonstration.

Avoid:

Overly complicated graphics

Excessive animations

Crowded screens

Too many colors

Hacker/matrix-style backgrounds

Unnecessary decorative elements

Prefer:

Clean white/light dashboard

Professional dark text

Subtle accent colors

Rounded cards

Clear spacing

Modern typography

Simple icons

Responsive layout

Consistent buttons

Clear tables

Professional charts

The UI should look polished and easy to understand during a project presentation.

Use a consistent visual hierarchy.

MAIN NAVIGATION

Create a sidebar navigation with:

Dashboard

Traffic Simulator

Detection & Classification

Prevention & Response

Security Logs

At the bottom of the sidebar display:

IDPS Prototype
Academic Demonstration

PAGE 1 – DASHBOARD

Create a professional dashboard showing real-time simulated statistics.

Top statistics cards:

Total Traffic

Normal Traffic

Suspicious Traffic

Threats Detected

Blocked IPs

Add a traffic overview chart showing:

Normal

Suspicious

Blocked

Add a "Recent Security Events" table:

Columns:

Time

Source IP

Threat

Severity

Action

Status

Use clear status badges.

Example:
NORMAL
DETECTED
BLOCKED
MONITORED

Add a prominent button:

GENERATE SAMPLE TRAFFIC

When clicked, generate several realistic simulated events and update the dashboard.

PAGE 2 – TRAFFIC SIMULATOR

Create a dedicated traffic simulation interface.

Title:

Network Traffic Simulator

Subtitle:

"Generate simulated network events for IDPS testing."

Create buttons:

Generate Normal Traffic

Simulate Port Scan

Simulate Brute Force

Simulate Abnormal Traffic

Generate Random Traffic

Each button should create realistic simulated traffic records.

Traffic table:

| Timestamp | Source IP | Destination IP | Port | Protocol | Packet Size | Frequency | Status |

Example records:

Normal:
192.168.1.10 → 192.168.1.1 → 80 → TCP → 512 bytes → Low → Normal

Port Scan:
192.168.1.105 → 192.168.1.1 → Multiple Ports → TCP → 128 bytes → Very High → Suspicious

Brute Force:
192.168.1.120 → 192.168.1.20 → 22 → TCP → 256 bytes → High → Suspicious

Add a small section:

Preprocessing Status

Show:

Records Collected

Duplicate Records Removed

Missing Values

Normalized Records

Processed Records

These values can be simulated.

PAGE 3 – DETECTION & CLASSIFICATION

Create a professional detection page.

Show detected events in a table.

Columns:

Event ID

Source IP

Destination IP

Protocol

Threat Type

Severity

Detection Reason

Status

Detection rules should be simple and understandable.

Example rules:

Port Scan

If the same source IP accesses multiple destination ports within a short simulated period → classify as Port Scan.

Brute Force

If repeated login attempts originate from the same IP → classify as Brute Force.

High-Frequency Traffic

If request/connection frequency exceeds a simulated threshold → classify as Abnormal Traffic.

Normal Traffic

If the traffic follows normal simulated patterns → classify as Normal.

When a threat is detected, display a notification/toast:

"Threat Detected: Port Scan"

PAGE 4 – PREVENTION & RESPONSE

Create a clean prevention page.

Display:

Threat Response Center

Show detected threats as cards or rows.

Each event should have:

Source IP

Threat Type

Severity

Detection Time

Current Status

Recommended Action

Add buttons:

BLOCK IP
MONITOR
DISMISS

IMPORTANT:
BLOCK IP must only simulate blocking inside the website.

After clicking BLOCK IP:

Change status to:

BLOCKED

Add the IP to a simulated blocked-IP list.

Show a confirmation:

"IP 192.168.1.105 has been blocked in the IDPS simulation."

Create a section:

Blocked IP Addresses

Columns:

IP Address

Threat

Severity

Blocked Time

Status

PAGE 5 – SECURITY LOGS

Create a professional security log table.

Columns:

Timestamp

Event ID

Source IP

Event Type

Severity

Detection Result

Prevention Action

Status

Allow:

Search

Filter by severity

Filter by status

Filter by threat type

Add buttons:

Export Logs
Clear Simulation

Export can download the simulated logs as CSV if practical.

DATA AND STATE

Use application state so that the simulation feels connected.

When traffic is generated:

Traffic appears in Traffic Simulator.

The event is processed.

Detection rules analyze it.

If suspicious, it appears in Detection & Classification.

An alert is generated.

The event appears in Prevention & Response.

Clicking BLOCK IP changes its simulated status to BLOCKED.

The event is recorded in Security Logs.

Dashboard statistics update automatically.

The entire application should work without requiring real network traffic.

Use realistic mock data initially so the dashboard is populated when opened.

DEMO SCENARIO

Make the application especially easy to demonstrate during a college presentation.

Provide a "Run Demo Simulation" button on the dashboard.

When clicked:

Generate a sequence such as:

Normal HTTP traffic

Normal DNS traffic

Port scan from 192.168.1.105

Brute-force login attempts from 192.168.1.120

High-frequency traffic from 192.168.1.150

Detect threats

Generate alerts

Show recommended prevention actions

The user should then be able to click BLOCK IP for suspicious events.

The dashboard should update visually.

SAMPLE DATA

Use private/local-looking example IP addresses only, such as:

192.168.1.10
192.168.1.25
192.168.1.105
192.168.1.120
192.168.1.150

Do not use real people's information.

TECHNICAL REQUIREMENTS

Build the frontend as a functional modern web application.

Prefer:

React

TypeScript

Tailwind CSS

Clean reusable components

Responsive design

Local state or local storage for simulation data

If a backend is necessary, keep it simple.

The application should run entirely as a safe simulation.

No real packet capture.
No real firewall modification.
No real IP blocking.
No system-level security changes.

VISUAL DETAILS

Make the dashboard look professional enough for a capstone presentation.

Use:

Clean cards

Simple line/bar/donut charts where useful

Professional tables

Severity badges

Status indicators

Tooltips where helpful

Responsive sidebar

Clear page titles

Consistent spacing

Use colors semantically:

Normal → subtle positive indicator

Warning → warning indicator

High/Critical → strong danger indicator

Blocked → clear blocked indicator

Do not overuse colors.

Keep the overall appearance clean, minimal, professional and modern.

IMPORTANT ACADEMIC SCOPE

The application must clearly represent itself as:

"A Web-Based IDPS Prototype for Simulated Network Traffic Analysis and Prevention."

Do not claim:

Real-time packet capture

Production-grade intrusion detection

Actual firewall integration

Actual network-level IP blocking

Enterprise SOC deployment

Guaranteed attack detection

Real-world security protection

The prototype is intended to visually demonstrate the concepts of:

Data Collection → Preprocessing → Detection → Classification → Alert → Simulated Prevention → Logging

Make sure all pages are connected and functional rather than being static mockup screens.

Finally, ensure the UI is clean, uncluttered, professional, responsive, and easy to demonstrate in a college viva/presentation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4237ba05-19c3-4b36-a904-a025641d01a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
