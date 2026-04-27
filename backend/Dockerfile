FROM python:3.11-slim

WORKDIR /app

# install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# copy requirements first for layer caching
COPY requirements.txt .

# install CPU-only torch first to avoid pulling CUDA version
RUN pip install --no-cache-dir \
    torch==2.2.2 torchvision==0.17.2 \
    --index-url https://download.pytorch.org/whl/cpu

# install everything else
RUN pip install --no-cache-dir -r requirements.txt

# copy source
COPY . .

# create chroma directory
RUN mkdir -p /app/chroma_db

# HF Spaces runs as non-root user 1000
RUN useradd -m -u 1000 user
RUN chown -R user:user /app
USER user

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]