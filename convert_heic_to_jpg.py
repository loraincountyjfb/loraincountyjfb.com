#!/usr/bin/env python3
"""
HEIC to JPG Converter Script

This script recursively finds all .heic files in the docs folder
and converts them to .jpg format while preserving the original files.
"""

import os
import sys
from pathlib import Path
from PIL import Image
import pillow_heif

def setup_heif_support():
    """Register HEIF opener with Pillow"""
    pillow_heif.register_heif_opener()

def convert_heic_to_jpg(heic_path, quality=95):
    """
    Convert a single HEIC file to JPG format
    
    Args:
        heic_path (Path): Path to the HEIC file
        quality (int): JPG quality (1-100, default 95)
    
    Returns:
        bool: True if conversion successful, False otherwise
    """
    try:
        # Create output path with .jpg extension
        jpg_path = heic_path.with_suffix('.jpg')
        
        # Skip if JPG already exists
        if jpg_path.exists():
            print(f"⏭️  Skipping {heic_path.name} - JPG already exists")
            return True
        
        # Open and convert the HEIC image
        with Image.open(heic_path) as image:
            # Convert to RGB if necessary (HEIC can have different color modes)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Save as JPG
            image.save(jpg_path, 'JPEG', quality=quality, optimize=True)
            
        print(f"✅ Converted {heic_path.name} -> {jpg_path.name}")
        return True
        
    except Exception as e:
        print(f"❌ Error converting {heic_path.name}: {str(e)}")
        return False

def find_heic_files(docs_path):
    """
    Recursively find all HEIC files in the docs directory
    
    Args:
        docs_path (Path): Path to the docs directory
    
    Returns:
        list: List of Path objects for HEIC files
    """
    heic_files = []
    
    # Search for both .heic and .HEIC extensions
    for pattern in ['**/*.heic', '**/*.HEIC']:
        heic_files.extend(docs_path.glob(pattern))
    
    return sorted(heic_files)

def main():
    """Main conversion process"""
    print("🔄 HEIC to JPG Converter")
    print("=" * 40)
    
    # Setup HEIF support
    setup_heif_support()
    
    # Find docs directory
    docs_path = Path('docs')
    if not docs_path.exists():
        print("❌ Error: 'docs' directory not found!")
        print("Make sure you're running this script from the project root directory.")
        sys.exit(1)
    
    # Find all HEIC files
    print(f"🔍 Searching for HEIC files in {docs_path}...")
    heic_files = find_heic_files(docs_path)
    
    if not heic_files:
        print("✨ No HEIC files found!")
        return
    
    print(f"📁 Found {len(heic_files)} HEIC files")
    print()
    
    # Convert each file
    successful = 0
    failed = 0
    
    for i, heic_file in enumerate(heic_files, 1):
        print(f"[{i}/{len(heic_files)}] Processing {heic_file.relative_to(docs_path)}...")
        
        if convert_heic_to_jpg(heic_file):
            successful += 1
        else:
            failed += 1
    
    # Summary
    print()
    print("=" * 40)
    print(f"✅ Successfully converted: {successful}")
    print(f"❌ Failed conversions: {failed}")
    print(f"📊 Total processed: {len(heic_files)}")
    
    if failed > 0:
        print("\n⚠️  Some files failed to convert. Check the error messages above.")
        sys.exit(1)
    else:
        print("\n🎉 All conversions completed successfully!")

if __name__ == "__main__":
    # Check for required dependencies
    try:
        import pillow_heif
        from PIL import Image
    except ImportError as e:
        print("❌ Missing required dependencies!")
        print("Please install them with:")
        print("  pip install Pillow pillow-heif")
        print(f"Error: {e}")
        sys.exit(1)
    
    main() 