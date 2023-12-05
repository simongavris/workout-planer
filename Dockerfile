# Use an official NGINX image as a parent image
FROM nginx:stable-alpine

# Copy the build directory from your local context to the container's web root directory
COPY build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Start NGINX by using the default command of the NGINX image
CMD ["nginx", "-g", "daemon off;"]
