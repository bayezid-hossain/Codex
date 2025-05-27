import os
import websocket
import json
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import threading

# Your connection parameters
wss_url = "wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
auth_token = "your_auth_token"
e2ee_key = "aGVsbG9teWZyaWVuZA=="  # This should be a properly formatted encryption key
room_name = "your_room_name"

# Convert e2ee_key to usable encryption key if needed
# Assuming the key is base64 encoded
encryption_key = base64.b64decode(e2ee_key)

# Define encryption/decryption functions
def encrypt_message(message, key):
    # Implement your encryption logic here based on the E2EE requirements
    # This is a placeholder - use appropriate algorithm and mode
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ct = encryptor.update(message.encode('utf-8')) + encryptor.finalize()
    return base64.b64encode(iv + ct).decode('utf-8')

def decrypt_message(encrypted_message, key):
    # Implement your decryption logic here
    # This is a placeholder
    data = base64.b64decode(encrypted_message)
    iv = data[:16]
    ct = data[16:]
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    return decryptor.update(ct) + decryptor.finalize()

# WebSocket callbacks
def on_message(ws, message):
    try:
        # Decrypt incoming messages
        decrypted = decrypt_message(message, encryption_key)
        print(f"Received: {decrypted.decode('utf-8')}")
    except Exception as e:
        print(f"Error decrypting message: {e}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"Connection closed: {close_status_code} - {close_msg}")

def on_open(ws):
    print("Connection established")
    
    # Join room message - adjust format as needed for your API
    join_msg = json.dumps({
        "type": "join",
        "room": room_name,
        "token": auth_token
    })
    
    # Encrypt the join message if required by your protocol
    # encrypted_join = encrypt_message(join_msg, encryption_key)
    # ws.send(encrypted_join)
    
    # Or send unencrypted if the protocol handles encryption differently
    ws.send(join_msg)

    # Start a thread for sending messages
    threading.Thread(target=send_messages, args=(ws,)).start()

def send_messages(ws):
    try:
        while True:
            message = input("Enter message (or 'exit' to quit): ")
            if message.lower() == 'exit':
                ws.close()
                break
                
            # Encrypt outgoing messages
            encrypted = encrypt_message(message, encryption_key)
            
            # Format as needed for your API
            payload = json.dumps({
                "type": "message",
                "room": room_name,
                "content": encrypted
            })
            
            ws.send(payload)
    except Exception as e:
        print(f"Error in send thread: {e}")

# Connect to WebSocket with headers if needed
headers = {
    "Authorization": f"Bearer {auth_token}"
}

# Initialize and run the WebSocket connection
ws = websocket.WebSocketApp(
    wss_url,
    header=headers,
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

# Start the WebSocket connection
ws.run_forever()