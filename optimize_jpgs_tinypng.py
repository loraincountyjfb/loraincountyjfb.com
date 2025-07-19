#!/usr/bin/env python3
"""
TinyPNG JPG Optimizer Script

This script finds all JPG files in the docs folder, compresses them using TinyPNG API,
and resizes them to a maximum width of 1000px while maintaining aspect ratio.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import tinify
from PIL import Image

def load_environment():
    """Load environment variables from .env file"""
    env_path = Path('.env')
    if not env_path.exists():
        print("❌ Error: .env file not found!")
        print("Make sure you have a .env file with TINYPNG_API_KEY in the project root.")
        sys.exit(1)
    
    load_dotenv(env_path)
    
    api_key = os.getenv('TINYPNG_API_KEY')
    if not api_key:
        print("❌ Error: TINYPNG_API_KEY not found in .env file!")
        print("Add your TinyPNG API key to .env:")
        print("TINYPNG_API_KEY=your_api_key_here")
        sys.exit(1)
    
    return api_key

def setup_tinypng(api_key):
    """Initialize TinyPNG with API key"""
    tinify.key = api_key
    
    # Validate API key by checking compression count
    try:
        tinify.validate()
        remaining = tinify.compression_count
        print(f"✅ TinyPNG API key validated")
        if remaining is not None:
            print(f"📊 Compressions used this month: {remaining}")
    except tinify.Error as e:
        print(f"❌ TinyPNG API key validation failed: {e}")
        sys.exit(1)

def get_image_dimensions(image_path):
    """Get image dimensions using PIL"""
    try:
        with Image.open(image_path) as img:
            return img.size  # (width, height)
    except Exception as e:
        print(f"⚠️  Could not read dimensions for {image_path.name}: {e}")
        return None, None

def calculate_new_dimensions(width, height, max_width=1000):
    """Calculate new dimensions maintaining aspect ratio"""
    if width <= max_width:
        return width, height  # No resize needed
    
    # Calculate new height maintaining aspect ratio
    aspect_ratio = height / width
    new_width = max_width
    new_height = int(max_width * aspect_ratio)
    
    return new_width, new_height

def optimize_image(jpg_path, max_width=1000, backup=True):
    """
    Optimize a single JPG image using TinyPNG with resize
    
    Args:
        jpg_path (Path): Path to the JPG file
        max_width (int): Maximum width in pixels
        backup (bool): Whether to create a backup of original
    
    Returns:
        bool: True if optimization successful, False otherwise
    """
    try:
        # Get original dimensions
        orig_width, orig_height = get_image_dimensions(jpg_path)
        if not orig_width or not orig_height:
            print(f"❌ Skipping {jpg_path.name} - could not read dimensions")
            return False
        
        # Calculate new dimensions
        new_width, new_height = calculate_new_dimensions(orig_width, orig_height, max_width)
        
        # Get original file size
        original_size = jpg_path.stat().st_size
        
        print(f"🔄 Processing {jpg_path.name}...")
        print(f"   Original: {orig_width}x{orig_height} ({original_size:,} bytes)")
        
        # Create backup if requested
        if backup:
            backup_path = jpg_path.with_suffix('.original.jpg')
            if not backup_path.exists():
                backup_path.write_bytes(jpg_path.read_bytes())
                print(f"   💾 Backup created: {backup_path.name}")
        
        # Read the source image
        source = tinify.from_file(str(jpg_path))
        
        # Apply resize if needed
        if new_width != orig_width or new_height != orig_height:
            resized = source.resize(
                method="fit",
                width=new_width,
                height=new_height
            )
            print(f"   📏 Resizing to: {new_width}x{new_height}")
        else:
            resized = source
            print(f"   📏 No resize needed (already ≤ {max_width}px wide)")
        
        # Save the optimized image
        resized.to_file(str(jpg_path))
        
        # Get new file size
        new_size = jpg_path.stat().st_size
        
        # Calculate savings
        size_reduction = original_size - new_size
        percentage_saved = (size_reduction / original_size) * 100 if original_size > 0 else 0
        
        print(f"   ✅ Optimized: {new_size:,} bytes (saved {size_reduction:,} bytes, {percentage_saved:.1f}%)")
        
        return True
        
    except tinify.AccountError as e:
        print(f"❌ TinyPNG account error for {jpg_path.name}: {e}")
        return False
    except tinify.ClientError as e:
        print(f"❌ TinyPNG client error for {jpg_path.name}: {e}")
        return False
    except tinify.ServerError as e:
        print(f"❌ TinyPNG server error for {jpg_path.name}: {e}")
        return False
    except tinify.ConnectionError as e:
        print(f"❌ TinyPNG connection error for {jpg_path.name}: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error processing {jpg_path.name}: {e}")
        return False

def find_jpg_files(docs_path):
    """
    Find all JPG files in the docs directory
    
    Args:
        docs_path (Path): Path to the docs directory
    
    Returns:
        list: List of Path objects for JPG files
    """
    jpg_files = []
    
    # Search for both .jpg and .JPG extensions
    for pattern in ['**/*.jpg', '**/*.JPG', '**/*.jpeg', '**/*.JPEG']:
        jpg_files.extend(docs_path.glob(pattern))
    
    return sorted(jpg_files)

def main():
    """Main optimization process"""
    print("🎨 TinyPNG JPG Optimizer")
    print("=" * 50)
    
    # Load environment variables
    api_key = load_environment()
    
    # Setup TinyPNG
    setup_tinypng(api_key)
    
    # Find docs directory
    docs_path = Path('docs')
    if not docs_path.exists():
        print("❌ Error: 'docs' directory not found!")
        print("Make sure you're running this script from the project root directory.")
        sys.exit(1)
    
    # Find all JPG files
    print(f"🔍 Searching for JPG files in {docs_path}...")
    jpg_files = find_jpg_files(docs_path)
    
    if not jpg_files:
        print("✨ No JPG files found!")
        return
    
    print(f"📁 Found {len(jpg_files)} JPG files")
    print()
    
    # Ask for confirmation
    max_width = 1000
    response = input(f"Optimize {len(jpg_files)} images with max width {max_width}px? (y/N): ")
    if response.lower() not in ['y', 'yes']:
        print("❌ Operation cancelled")
        return
    
    print()
    
    # Process each file
    successful = 0
    failed = 0
    total_original_size = 0
    total_optimized_size = 0
    
    for i, jpg_file in enumerate(jpg_files, 1):
        print(f"[{i}/{len(jpg_files)}] {jpg_file.relative_to(docs_path)}")
        
        # Track original size
        original_size = jpg_file.stat().st_size
        total_original_size += original_size
        
        if optimize_image(jpg_file, max_width):
            successful += 1
            # Track optimized size
            optimized_size = jpg_file.stat().st_size
            total_optimized_size += optimized_size
        else:
            failed += 1
            total_optimized_size += original_size  # No change if failed
        
        print()
    
    # Final summary
    print("=" * 50)
    print(f"✅ Successfully optimized: {successful}")
    print(f"❌ Failed optimizations: {failed}")
    print(f"📊 Total processed: {len(jpg_files)}")
    
    if successful > 0:
        total_saved = total_original_size - total_optimized_size
        percentage_saved = (total_saved / total_original_size) * 100 if total_original_size > 0 else 0
        
        print(f"💾 Total size reduction: {total_saved:,} bytes ({percentage_saved:.1f}%)")
        print(f"📏 Original total: {total_original_size:,} bytes")
        print(f"📏 Optimized total: {total_optimized_size:,} bytes")
    
    # Check remaining API usage
    try:
        remaining = tinify.compression_count
        if remaining is not None:
            print(f"📊 TinyPNG compressions used this month: {remaining}")
    except:
        pass
    
    if failed > 0:
        print("\n⚠️  Some files failed to optimize. Check the error messages above.")
        sys.exit(1)
    else:
        print("\n🎉 All optimizations completed successfully!")

if __name__ == "__main__":
    # Check for required dependencies
    try:
        import tinify
        from PIL import Image
        from dotenv import load_dotenv
    except ImportError as e:
        print("❌ Missing required dependencies!")
        print("Please install them with:")
        print("  pip install tinify python-dotenv Pillow")
        print(f"Error: {e}")
        sys.exit(1)
    
    main() 