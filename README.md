# Zoom-clone
## A clone of the popular video conferencing app.

### Features and How-To
- Head over to the original URL to create a new room and to join it.
- Share the URL from the address bar for someone else to join the same room.
- Each room URL consists of the original URL + an alphanumeric string. The alphanumeric string uniquely identifies the room.
- Each person has to enter their name before entering/creating the room.
- Mic mute/unmute and video on/off toggle options are there.
- Messaging feature is also available.

### ** Steps to Run **
1. Download the repository.
2. Generate your own ssl certificates and store them in the root directory (you can use any service like OpenSSL).
3. The name of the certificates should be "cert.pem" and "key.pem".
4. Run npm start in the command line in the root directory.
5. Head over to https://localhost:3030 and enjoy!

