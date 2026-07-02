-- Enable RLS on Tenant
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Tenant"
  USING (id = current_setting('app.current_tenant_id', TRUE));

-- Enable RLS on User
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation_policy ON "User"
  USING ("tenantId" = current_setting('app.current_tenant_id', TRUE));

-- Enable RLS on Student
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
CREATE POLICY student_isolation_policy ON "Student"
  USING ("tenantId" = current_setting('app.current_tenant_id', TRUE));

-- Enable RLS on Professor
ALTER TABLE "Professor" ENABLE ROW LEVEL SECURITY;
CREATE POLICY professor_isolation_policy ON "Professor"
  USING ("tenantId" = current_setting('app.current_tenant_id', TRUE));

-- Enable RLS on Faculty
ALTER TABLE "Faculty" ENABLE ROW LEVEL SECURITY;
CREATE POLICY faculty_isolation_policy ON "Faculty"
  USING ("tenantId" = current_setting('app.current_tenant_id', TRUE));

-- Note: Other tables can be linked through joins or directly to tenantId.
