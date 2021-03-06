"use strict";

var version = require("flying-squid").version;
var windows = require("prismarine-windows")(version).windows;
var Item = require("prismarine-item")(version);

module.exports.player = function (player, serv) {
  player.heldItemSlot = 0;
  player.heldItem = new Item(256, 1);
  player.inventory = new windows.InventoryWindow(0, "Inventory", 44);

  player._client.on("held_item_slot", function () {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var slotId = _ref.slotId;

    player.heldItemSlot = slotId;
    player.setEquipment(0, player.inventory.slots[36 + player.heldItemSlot]);

    player._writeOthersNearby("entity_equipment", {
      entityId: player.id,
      slot: 0,
      item: Item.toNotch(player.heldItem)
    });
  });

  player._client.on("window_click", function (clickInfo) {
    // Do other stuff the inventory doesn't do, eg spawn the dropped item.
    // I've left in stuff that inventory handles, because the cancelling hooks
    // might go here (?)
    switch (clickInfo.mode) {
      case 0:
        if (clickInfo.mouseButton == 0) {
          // Left mouse click
          // Inventory deals with this
        } else {
            // Right mouse click
            // Inventory deals with this
          }
        break;

      case 1:
        if (clickInfo.mouseButton == 0) {
          // Shift + Left click
          // Inventory deals with this
          return;
        } else {
          // Shift + right click
          // Inventory deals with this
          return;
        }
        break;

      case 2:
        // button 0 -> 8, indication hotbar switching items
        // (Nothing to do with held_item_slot)
        // DANGER! crashes because windows.js hasn't implemented it yet.
        return;
        break;

      case 3:
        // Middle click
        // DANGER! crashes because windows.js hasn't implemented it yet.
        return;
        break;

      case 4:
        if (clickInfo.slot == -999) {
          // Click with nothing outside window. Do nothing.
        } else {
            // I'd love to implement this, but dropped entities are not finished.
            if (clickInfo.mouseButton == 0) {
              // Drop one item at slot
              // Inventory handles removing one
              return;
            } else {
              // Drop full stack at slot
              // Inventory handles removing the whole stack
              return;
            }
          }
        break;

      // Inventory does not support dragging yet, so not implementing yet.
      case 5:
        if (clickInfo.slot == -999) {
          switch (clickInfo.mouseButton) {
            case 0:
              // Start left mouse drag
              return;
              break;

            case 4:
              // Start right mouse drag
              return;
              break;

            case 2:
              // End left mouse drag
              return;
              break;

            case 6:
              // End right mouse drag
              return;
              break;
          }
        } else {
          switch (clickInfo.mouseButton) {
            case 1:
              // Add slot for left mouse drag
              return;
              break;

            case 5:
              // Add slot for right mouse drag
              return;
              break;
          }
        }
        break;

      // Inventory does not support double click yet, so not implementing yet.
      case 6:
        // Double click
        return;
        break;
    }

    // Let the inventory know of the click.
    // It's important to let it know of the click later, because it destroys
    // information we need about the inventory.
    try {
      player.inventory.acceptClick(clickInfo);
    } catch (err) {
      serv.emit('error', err);
    }
  });

  player._client.on("set_creative_slot", function () {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var slot = _ref2.slot;
    var item = _ref2.item;

    if (item.blockId == -1) {
      player.inventory.updateSlot(slot, undefined);
      return;
    }

    var newItem = Item.fromNotch(item);
    player.inventory.updateSlot(slot, newItem);
  });

  player.inventory.on("windowUpdate", function (slot, oldItem, newItem) {

    var equipments = {
      5: 4,
      6: 3,
      7: 2,
      8: 1
    };
    equipments[player.heldItemSlot] = 0;
    if (equipments[slot] !== undefined) {
      player.setEquipment(equipments[slot], newItem);
      player._writeOthersNearby("entity_equipment", {
        entityId: player.id,
        slot: equipments[slot],
        item: Item.toNotch(newItem)
      });
    }

    player._client.write("set_slot", {
      windowId: 0,
      slot: slot,
      item: Item.toNotch(newItem)
    });
  });

  player.collect = function (collectEntity) {

    // Add it to a stack already in the player's inventory if possible
    for (var itemKey = 0; itemKey < player.inventory.slots.length; itemKey++) {
      var item = player.inventory.slots[itemKey];
      if (item == undefined) continue;
      if (item.type == collectEntity.itemId) {
        item.count += 1;
        player.inventory.updateSlot(itemKey, item);
        collectEntity._writeOthersNearby('collect', {
          collectedEntityId: collectEntity.id,
          collectorEntityId: player.id
        });
        player.playSoundAtSelf('random.pop');
        collectEntity.destroy();
        return;
      }
    }

    // If we couldn't add it to a already existing stack, put it in a new stack if the inventory has room
    var emptySlot = player.inventory.firstEmptyInventorySlot();
    if (emptySlot != null) {
      collectEntity._writeOthersNearby('collect', {
        collectedEntityId: collectEntity.id,
        collectorEntityId: player.id
      });
      player.playSoundAtSelf('random.pop');

      var newItem = new Item(collectEntity.itemId, 1, collectEntity.damage);
      player.inventory.updateSlot(emptySlot, newItem);
      collectEntity.destroy();
    }
  };
};
//# sourceMappingURL=../../maps/lib/plugins/inventory.js.map
