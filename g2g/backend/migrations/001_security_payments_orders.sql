-- Run this against the ShopBanHang SQL Server database before enabling
-- admin payment approval and the expanded order flow.

IF OBJECT_ID('dbo.PaymentRequests', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PaymentRequests (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Amount DECIMAL(18, 2) NOT NULL,
        Provider NVARCHAR(50) NOT NULL DEFAULT N'manual',
        Status NVARCHAR(20) NOT NULL DEFAULT N'pending',
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        ApprovedBy INT NULL,
        ApprovedAt DATETIME2 NULL,
        CONSTRAINT CK_PaymentRequests_Amount_Positive CHECK (Amount > 0),
        CONSTRAINT CK_PaymentRequests_Status CHECK (Status IN (N'pending', N'approved', N'rejected', N'cancelled'))
    );
END;

IF OBJECT_ID('dbo.SellerRequests', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SellerRequests (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ShopName NVARCHAR(150) NOT NULL,
        Address NVARCHAR(300) NOT NULL,
        Phone NVARCHAR(30) NOT NULL,
        IdCardFrontUrl NVARCHAR(500) NOT NULL,
        IdCardBackUrl NVARCHAR(500) NOT NULL,
        Note NVARCHAR(500) NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT N'pending',
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        ApprovedBy INT NULL,
        ApprovedAt DATETIME2 NULL,
        CONSTRAINT CK_SellerRequests_Status CHECK (Status IN (N'pending', N'approved', N'rejected', N'cancelled'))
    );
END;

IF COL_LENGTH('dbo.SellerRequests', 'Address') IS NULL
    ALTER TABLE dbo.SellerRequests ADD Address NVARCHAR(300) NULL;

IF COL_LENGTH('dbo.SellerRequests', 'IdCardFrontUrl') IS NULL
    ALTER TABLE dbo.SellerRequests ADD IdCardFrontUrl NVARCHAR(500) NULL;

IF COL_LENGTH('dbo.SellerRequests', 'IdCardBackUrl') IS NULL
    ALTER TABLE dbo.SellerRequests ADD IdCardBackUrl NVARCHAR(500) NULL;

IF OBJECT_ID('dbo.BalanceAuditLogs', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.BalanceAuditLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Amount DECIMAL(18, 2) NOT NULL,
        Action NVARCHAR(50) NOT NULL,
        ReferenceType NVARCHAR(50) NULL,
        ReferenceId INT NULL,
        CreatedBy INT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;

IF OBJECT_ID('dbo.Orders', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        SellerId INT NULL,
        TotalPrice DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT N'paid',
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT CK_Orders_TotalPrice_Positive CHECK (TotalPrice > 0),
        CONSTRAINT CK_Orders_Status CHECK (Status IN (N'pending', N'paid', N'delivered', N'cancelled', N'refunded'))
    );
END;

IF COL_LENGTH('dbo.Orders', 'SellerId') IS NULL
    ALTER TABLE dbo.Orders ADD SellerId INT NULL;

IF OBJECT_ID('dbo.OrderItems', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderId INT NOT NULL,
        ProductId INT NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(18, 2) NOT NULL,
        TotalPrice DECIMAL(18, 2) NOT NULL,
        CONSTRAINT CK_OrderItems_Quantity_Positive CHECK (Quantity > 0),
        CONSTRAINT CK_OrderItems_UnitPrice_Positive CHECK (UnitPrice > 0),
        CONSTRAINT CK_OrderItems_TotalPrice_Positive CHECK (TotalPrice > 0)
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Users_Mail' AND object_id = OBJECT_ID('dbo.Users'))
    CREATE UNIQUE INDEX UX_Users_Mail ON dbo.Users(Mail);

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Users_Balance_NonNegative')
    ALTER TABLE dbo.Users ADD CONSTRAINT CK_Users_Balance_NonNegative CHECK (Balance >= 0);

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Products_Quantity_NonNegative')
    ALTER TABLE dbo.Products ADD CONSTRAINT CK_Products_Quantity_NonNegative CHECK (Quantity >= 0);

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Products_Price_Positive')
    ALTER TABLE dbo.Products ADD CONSTRAINT CK_Products_Price_Positive CHECK (Price > 0);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Products_Status_CreatedAt' AND object_id = OBJECT_ID('dbo.Products'))
    CREATE INDEX IX_Products_Status_CreatedAt ON dbo.Products(Status, CreatedAt DESC);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Transactions_UserId' AND object_id = OBJECT_ID('dbo.Transactions'))
    CREATE INDEX IX_Transactions_UserId ON dbo.Transactions(UserId);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PaymentRequests_UserId_Status' AND object_id = OBJECT_ID('dbo.PaymentRequests'))
    CREATE INDEX IX_PaymentRequests_UserId_Status ON dbo.PaymentRequests(UserId, Status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_SellerRequests_UserId_Pending' AND object_id = OBJECT_ID('dbo.SellerRequests'))
    CREATE UNIQUE INDEX UX_SellerRequests_UserId_Pending ON dbo.SellerRequests(UserId) WHERE Status = N'pending';

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_SellerRequests_Status_CreatedAt' AND object_id = OBJECT_ID('dbo.SellerRequests'))
    CREATE INDEX IX_SellerRequests_Status_CreatedAt ON dbo.SellerRequests(Status, CreatedAt DESC);

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_SellerRequests_Required_Profile')
    ALTER TABLE dbo.SellerRequests WITH NOCHECK ADD CONSTRAINT CK_SellerRequests_Required_Profile CHECK (
        ShopName IS NOT NULL AND LTRIM(RTRIM(ShopName)) <> N'' AND
        Address IS NOT NULL AND LTRIM(RTRIM(Address)) <> N'' AND
        Phone IS NOT NULL AND LTRIM(RTRIM(Phone)) <> N'' AND
        IdCardFrontUrl IS NOT NULL AND LTRIM(RTRIM(IdCardFrontUrl)) <> N'' AND
        IdCardBackUrl IS NOT NULL AND LTRIM(RTRIM(IdCardBackUrl)) <> N''
    );

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Orders_UserId_CreatedAt' AND object_id = OBJECT_ID('dbo.Orders'))
    CREATE INDEX IX_Orders_UserId_CreatedAt ON dbo.Orders(UserId, CreatedAt DESC);
