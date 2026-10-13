#!/usr/bin/env python3
"""
Startup script for the Aegis platform
Launches both backend and frontend for demonstration
"""

import subprocess
import sys
import time
import os

def start_backend():
    """Start the FastAPI backend"""
    print("Starting Aegis Backend...")
    try:
        # Don't capture stdout/stderr - let them stream to console
        backend_process = subprocess.Popen(
            [sys.executable, "main.py"],
            cwd="./backend",
            # No stdout/stderr pipes = output goes to console
        )

        # Wait a moment for server to start
        time.sleep(4)

        # Check if process is still running
        if backend_process.poll() is None:
            print("Backend started successfully on http://localhost:8000")
            return backend_process
        else:
            print("Backend failed to start (process terminated)")
            return None
    except Exception as e:
        print(f"Error starting backend: {e}")
        return None

def start_frontend():
    """Start the Next.js frontend"""
    print("Starting Aegis Frontend...")
    try:
        use_shell = sys.platform == "win32"
        # Don't capture stdout/stderr - let them stream to console
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd="./frontend",
            shell=use_shell
        )

        # Wait a moment for server to start
        time.sleep(10)

        # Check if process is still running
        if frontend_process.poll() is None:
            print("Frontend started successfully on http://localhost:3000")
            return frontend_process
        else:
            print("Frontend failed to start (process terminated)")
            return None
    except Exception as e:
        print(f"Error starting frontend: {e}")
        return None

def main():
    """Main function to start both backend and frontend"""
    print("Starting Aegis AI-Powered Decision Intelligence Platform")
    print("=" * 60)

    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("Failed to start backend. Exiting.")
        return 1

    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("Failed to start frontend. Stopping backend...")
        backend_process.terminate()
        return 1

    print("\n" + "=" * 60)
    print("Aegis Platform is now running!")
    print("Backend API: http://localhost:8000")
    print("Frontend UI: http://localhost:3000")
    print("API Docs: http://localhost:8000/docs")
    print("\nTo stop the platform, press Ctrl+C")
    print("=" * 60)

    try:
        # Keep the script running and monitor processes
        while True:
            # Check if either process has terminated
            if backend_process.poll() is not None:
                print("Backend process has terminated unexpectedly")
                break
            if frontend_process.poll() is not None:
                print("Frontend process has terminated unexpectedly")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nReceived shutdown signal...")
    finally:
        # Clean up processes
        print("Stopping services...")
        if backend_process.poll() is None:
            backend_process.terminate()
            backend_process.wait()
            print("Backend stopped")

        if frontend_process.poll() is None:
            frontend_process.terminate()
            frontend_process.wait()
            print("Frontend stopped")

        print("Aegis Platform stopped")

if __name__ == "__main__":
    # Change to the Aegis directory if not already there
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    sys.exit(main())