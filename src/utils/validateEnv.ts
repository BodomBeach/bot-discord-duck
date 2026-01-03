const requiredEnvVars = [
  'GUILD_ID',
  'BOT_TOKEN',
  'STRUCTURE_ID',
  'CATEGORY_SORTIES',
  'CATEGORY_SORTIES_PAS_RAPENTE',
  'CATEGORY_COMPETITIONS',
  'CATEGORY_EVENEMENTS',
  'CHANNEL_BIENVENUE',
  'CHANNEL_GUIDE_DISCORD',
  'CHANNEL_STATS',
  'CHANNEL_METEO',
  'ROLE_ADMINS',
  'ROLE_STAFF',
  'ROLE_BIPLACEURS',
  'ROLE_LICENCIE_PREFIX',
] as const;

export function validateEnv(): void {
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Error: Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are defined.');
    process.exit(1);
  }

  console.log('✓ All environment variables are properly defined');
}
