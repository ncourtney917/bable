# Use the official Microsoft Data API Builder image with specific version
FROM mcr.microsoft.com/azure-databases/data-api-builder:1.6.67

# Set the working directory
WORKDIR /app

# Copy the DAB configuration file
COPY dab-config.json /app/dab-config.json

# Expose the port that DAB runs on
EXPOSE 5000

# Set environment variables
ENV DAB_CONFIG_FILE=/app/dab-config.json
ENV ASPNETCORE_URLS=http://+:5000

# Health check optimized for Container Instances
HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=2 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start Data API Builder with optimized settings for Container Instances
CMD ["dab", "start", "--config", "/app/dab-config.json", "--urls", "http://+:5000"]
