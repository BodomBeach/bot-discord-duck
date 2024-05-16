// TODO -> Archive by transforming channel into a thread in the 'archives' channel
export const allowedCategories = ['🪂 SORTIES', '🏃Sorties pas rapente', '🏆 Compétitions'];

export async function archive(channel) {
    const archiveCategories = channel.guild.channels.cache.filter(channel => channel.type === 4 && channel.name.slice(0,11).toLowerCase() === '📁archives_');
    let available_archive = archiveCategories.find(cat => cat.children.cache.size < 3)

    if (available_archive) {
        channel.setParent(available_archive)
    } else {
        // creating a new archive category
        const count = Math.max(...archiveCategories.map(cat => parseInt(cat.name.split('_')[1])))
        available_archive = await channel.guild.channels.create({
            name: `📁archives_${count + 1}`,
            type: 4,
        })
        console.log('Created new archive category');
        channel.setParent(available_archive)
    }
}