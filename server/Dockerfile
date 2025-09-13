# Dockerfile

# Use the official .NET SDK image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["SupportDashboard.Api.csproj", "./"]
RUN dotnet restore "./SupportDashboard.Api.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "./SupportDashboard.Api.csproj" -c Release -o /app/publish

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SupportDashboard.Api.dll"]
