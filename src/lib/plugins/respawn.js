module.exports.player=function(player)
{
  player._client.on("client_command", ({payload}) => {
    if(payload == 0) {
      player.behavior('requestRespawn', {}, () => {
        player._client.write("respawn",{
          dimension:0,
          difficulty:0,
          gamemode:player.gameMode,
          levelType:'default'
        });
        player.sendSelfPosition();
        player.updateHealth(20);
        player.nearbyEntities=[];
        player.updateAndSpawn();
      });
    }
  });
};