
# agent/agent.py
import platform
import psutil
import requests
import winreg
import subprocess
import json
import os
from datetime import datetime

GREYNOISE_API_KEY = 'bmeNWnfBIykcVZIc2UIWpIrnHDZUNUrK9sH56CnGnDeSwuv9eYkjxuLiGYm3Dim2'  # Cambiar por variable de entorno en producción

def get_system_info():
    ip_address = get_ip_address()
    shodan_data = get_shodan_data(ip_address)
    grey_noise_data = get_grey_noise_data(ip_address)
    return {
        'name': platform.node(),
        'os': f"{platform.system()} {platform.release()}",
        'ipAddress': ip_address,
        'cpuUsage': psutil.cpu_percent(interval=1),
        'memoryUsage': psutil.virtual_memory().percent,
        'browsers': get_browser_versions(),
        'software': get_installed_software(),
        'shodanData': shodan_data,
        'greyNoiseData': grey_noise_data,
    }

def get_ip_address():
    try:
        return requests.get('https://api.ipify.org').text
    except:
        return 'Desconocido'

def get_shodan_data(ip):
    try:
        response = requests.get(f'https://internetdb.shodan.io/{ip}')
        return response.json() if response.status_code == 200 else {'ports': [], 'cpes': [], 'vulns': [], 'tags': []}
    except:
        return {'ports': [], 'cpes': [], 'vulns': [], 'tags': []}

def get_grey_noise_data(ip):
    try:
        response = requests.get(
            f'https://api.greynoise.io/v3/community/{ip}',
            headers={'Accept': 'application/json', 'key': GREYNOISE_API_KEY}
        )
        if response.status_code == 200:
            data = response.json()
            return {
                'noise': data.get('noise', False),
                'riot': data.get('riot', False),
                'classification': data.get('classification', 'unknown'),
                'name': data.get('name', ''),
                'lastSeen': data.get('last_seen', '')
            }
        return {'noise': False, 'riot': False, 'classification': 'unknown', 'name': '', 'lastSeen': ''}
    except:
        return {'noise': False, 'riot': False, 'classification': 'unknown', 'name': '', 'lastSeen': ''}

def get_browser_versions():
    browsers = []
    try:
        chrome_path = r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, chrome_path) as key:
            path = winreg.QueryValueEx(key, "")[0]
            version_cmd = f'"{path}" --version'
            version = subprocess.check_output(version_cmd, shell=True).decode().strip()
            browsers.append({'name': 'Chrome', 'version': version.replace('Google Chrome ', '')})
    except:
        pass
    return browsers

def get_installed_software():
    software = []
    try:
        cmd = 'wmic product get name,version'
        output = subprocess.check_output(cmd, shell=True).decode()
        lines = output.splitlines()[1:]
        for line in lines:
            if line.strip():
                parts = line.split(None, 1)
                if len(parts) == 2:
                    name, version = parts
                    software.append({'name': name.strip(), 'version': version.strip()})
    except:
        pass
    return software

def check_vulnerabilities(software):
    cves = []
    for s in software:
        try:
            response = requests.get(
                'http://localhost:3001/api/cves',
                params={'software': s['name'].lower(), 'version': s['version']}
            )
            data = response.json()
            for vuln in data:
                cves.append({
                    'cveId': vuln.get('cve', {}).get('id', 'Unknown'),
                    'severity': vuln.get('cve', {}).get('metrics', {}).get('cvssMetricV31', [{}])[0].get('cvssData', {}).get('baseSeverity', 'Unknown'),
                    'description': vuln.get('cve', {}).get('descriptions', [{}])[0].get('value', 'Sin descripción'),
                })
        except:
            pass
    return cves

def register_device(token, device_info):
    response = requests.post(
        'http://localhost:3001/api/register-device',
        json={'token': token, 'deviceInfo': device_info}
    )
    return response.json()

def main():
    token = input("Ingresa tu token del dashboard: ")
    device_info = get_system_info()
    device_info['cves'] = check_vulnerabilities(device_info['software'])
    result = register_device(token, device_info)
    print("Registro del dispositivo:", result)

if __name__ == '__main__':
    main()