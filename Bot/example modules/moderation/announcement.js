const handleAnnounce = async (message, config, webhook) => {
    const announcmentMsg = message.content.replace(`${config.prefix}announce`, '').trim();
    await webhook.send('_ _', {
      embeds: [{
        title: config.announcement.title,
        color: config.announcement.color,
        fields: [{
          name: '_ _',
          value: announcmentMsg,
        }],
      }],
    });
    message.delete();
  };
  
  module.exports = {
    handleAnnounce,
  };