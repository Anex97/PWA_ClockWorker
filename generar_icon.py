#!/usr/bin/env python3
"""
Genera iconos PNG válidos sin dependencias externas (solo stdlib)
Crea icon-192.png e icon-512.png con diseño de reloj azul
"""
import struct
import zlib
import math

def crear_png(width, height, pixeles):
    """Crea un PNG válido desde una lista de tuplas (r,g,b)"""
    
    def chunk(tipo, datos):
        bloque = tipo + datos
        return struct.pack('>I', len(datos)) + bloque + struct.pack('>I', zlib.crc32(bloque) & 0xffffffff)
    
    # Firma PNG
    firma = b'\x89PNG\r\n\x1a\n'
    
    # IHDR: 4=width, 4=height, 1=bitdepth(8), 1=colortype(2=RGB), 1=compr, 1=filter, 1=interlace
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
    
    # IDAT: datos de imagen (sin filtro por fila)
    datos_raw = b''
    for y in range(height):
        datos_raw += b'\x00'  # filtro = none
        for x in range(width):
            r, g, b = pixeles[y * width + x]
            datos_raw += bytes([r, g, b])
    
    idat = chunk(b'IDAT', zlib.compress(datos_raw, 9))
    
    # IEND
    iend = chunk(b'IEND', b'')
    
    return firma + ihdr + idat + iend


def generar_icono(size):
    """Genera icono con diseño de reloj azul oscuro con detalles"""
    pixeles = []
    cx = size / 2
    cy = size / 2
    r = size / 2
    
    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            
            if dist > r:
                pixeles.append((0, 26, 51))    # #001a33 - fondo
            elif dist > r * 0.95:
                pixeles.append((0, 168, 232))  # #00a8e8 - borde exterior
            elif dist > r * 0.85:
                pixeles.append((0, 26, 51))    # #001a33 - anillo oscuro
            elif dist > r * 0.15:
                pixeles.append((0, 77, 122))   # #004d7a - cara del reloj
            else:
                pixeles.append((0, 168, 232))  # #00a8e8 - centro
    
    return crear_png(size, size, pixeles)


print("Generando iconos PNG...")

datos_192 = generar_icono(192)
with open('icon-192.png', 'wb') as f:
    f.write(datos_192)
print(f"✓ icon-192.png generado ({len(datos_192)} bytes)")

datos_512 = generar_icono(512)
with open('icon-512.png', 'wb') as f:
    f.write(datos_512)
print(f"✓ icon-512.png generado ({len(datos_512)} bytes)")
