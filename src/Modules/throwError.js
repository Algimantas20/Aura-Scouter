export async function BotLogOut(client) {
    try { await client.destroy(); console.log('✅ Bot logged out successfully.');} 
    catch (error) { console.error('Error while logging out:', error);} 
    finally { process.exit(1) }
}

export async function ThrowError({ string, err, client }) {
    console.error(`❌ ${string}`, err);
    await BotLogOut(client);
}