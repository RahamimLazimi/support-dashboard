# שלב 1: תמונת בסיס להרצה
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# שלב 2: תמונת בסיס לבנייה
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# העתק את קובץ הפרויקט
COPY server/SupportDashboard.Api.csproj ./

# שחזור תלויות
RUN dotnet restore "./SupportDashboard.Api.csproj"

# העתק את כל שאר הקוד
COPY server/. ./

# בניית האפליקציה
RUN dotnet publish "./SupportDashboard.Api.csproj" -c Release -o /app/publish

# שלב 3: יצירת התמונה הסופית
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# הגדרת הפקודה שתורץ
ENTRYPOINT ["dotnet", "SupportDashboard.Api.dll"]
