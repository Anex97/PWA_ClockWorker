#!/usr/bin/env python3
"""
Genera un icono PNG válido (192x192px) para la PWA
Requisito: pip install pillow
"""

try:
    from PIL import Image, ImageDraw
    
    # Crear imagen 192x192 con gradiente azul
    img = Image.new('RGB', (192, 192), color='#001a33')
    draw = ImageDraw.Draw(img)
    
    # Dibujar círculo decorativo
    # Color azul claro (#00a8e8) con borde azul oscuro
    draw.ellipse([(20, 20), (172, 172)], fill='#00a8e8', outline='#001a33', width=3)
    
    # Dibujar círculo interior para efecto "reloj"
    draw.ellipse([(50, 50), (142, 142)], fill='#004d7a', outline='#00a8e8', width=2)
    
    # Dibujar un pequeño círculo en el centro (como el centro del reloj)
    draw.ellipse([(88, 88), (104, 104)], fill='#00a8e8')
    
    # Guardar el icono
    img.save('icon-192.png', 'PNG')
    print("✓ icon-192.png generado correctamente (192x192px)")
    print("  Color: Tema azul (#001a33 - #00a8e8)")
    print("  Diseño: Círculo reloj")
    
except ImportError:
    print("✗ Pillow no está instalado")
    print("Instálalo con: pip install pillow")
    print("O descarga un PNG válido manualmente")
except Exception as e:
    print(f"✗ Error: {e}")
