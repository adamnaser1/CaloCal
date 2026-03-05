from PIL import Image
from typing import Tuple

def preprocess_image(
    image: Image.Image,
    max_size: int = 512
) -> Image.Image:
    """
    Resize and prepare image for ML inference
    """
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize if too large
    if max(image.size) > max_size:
        image.thumbnail((max_size, max_size), Image.LANCZOS)
    
    return image
