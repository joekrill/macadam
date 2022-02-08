// This prevents MikroORM from throwing an error when we mock out Mikro-ORM packages.
process.env = Object.assign(process.env, {
  MIKRO_ORM_ALLOW_VERSION_MISMATCH: "1",
});
