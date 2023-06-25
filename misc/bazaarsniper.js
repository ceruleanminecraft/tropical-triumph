        (() => {
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            let sniper = true;
            const item = prompt("What item would you like to snipe?\nCapitalization doesn't matter, but spelling " +
                    "& spaces do.");
            const snipeAmt = parseInt(prompt("How many shells should be the maximum shells to buy the item?"));
            const snipeInterval = parseInt(prompt("How often should the sniper check for items? (in milliseconds)"));
            const username = prompt("What is your username? (case sensitive)");
            const items = [
                "Broken Glass",
                "Rusty Nails",
                "Old Coins",
                "Glass Bottle",
                "Pearl Necklace",
                "Gold Doubloon",
                "Jeweled Crown",
                "Sea Shell Fossil",
                "Coral Fossil",
                "Crinoid Fossil",
                "Shark Tooth",
                "Ammonite Fossil",
                "Dinosaur Bone Fragment",
                "Trilobite Fossil",
                "White Sea Glass",
                "Green Sea Glass",
                "Brown Sea Glass",
                "Blue Sea Glass",
                "Amber Sea Glass",
                "Red Sea Glass",
                "Black Sea Glass",
                "Seaweed",
                "Sea Urchin Skeleton",
                "Hermit Crab Shell",
                "Sea Anemone",
                "Sea Sponge",
                "Starfish",
                "Seahorse",
                "Pebble",
                "Sandstone",
                "Agate",
                "Jasper",
                "Ammonite",
                "Geode",
                "Moonstone"
            ];
        
            const itemIndex = items.findIndex(i => i.toLowerCase() === item.toLowerCase());
            if (itemIndex === -1) {
                if (item.includes("glass")) alert("Please make sure to include \"Sea\" in the sea glass, e.g: \"Black Sea Glass\"")
                return alert("That item doesn't exist.")
            }
            if (isNaN(snipeAmt)) 
                return alert("That isn't a number.");
            
            alert("Press \\ to toggle the sniper.\nThe sniper will log to the console when it buys " +
                    "an item.");
        
            document.addEventListener("keydown", (e) => {
                if (e.key === "\\") {
                    sniper = !sniper;
                    alert(`Sniper is now ${sniper
                        ? "enabled"
                        : "disabled"}`);
                }
            });
        
            setInterval(() => {
                if (!sniper) return;
                const itemToSnipe = items[itemIndex];
                console.log(`[SNIPER] Checking for ${itemToSnipe} under ${snipeAmt} tokens.`)
                fetch(`/api/bazaar?item=${encodeURIComponent(itemToSnipe)}`)
                    .then(response => response.json())
                    .then(data => {
                        data
                            .bazaar
                            .filter(item => item.price < snipeAmt)
                            .forEach(async(a) => {
                                await sleep(300);
                                if (a.seller === username) return;
                                fetch("/api/bazaar/buy", {
                                    method: "POST",
                                    body: JSON.stringify({id: a.id}),
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    })
                                    .then(response => response.json())
                                    .then(ress => {
                                        console.log(`[SNIPER] Bought one ${itemToSnipe} for ${a.price} token(s) from ${a.seller}`);
                                    });
                            });
                    });
            }, snipeInterval);
        })();