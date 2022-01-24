const layersOrder = [
    {
        name: 'body',
        number: {
            common:   0,
            uncommon: 1,
            rare:     0,
            epic:     0,
        }
    },
    {
        name: 'ears',
        number: {
            common:   0,
            uncommon: 2,
            rare:     0,
            epic:     0,
        }
    },

    {
        name: 'skin',
        number: {
            common:   0,
            uncommon: 2,
            rare:     0,
            epic:     0,
        }
    },
    {
        name: 'eyes',
        number: {
            common:   0,
            uncommon: 1,
            rare:     0,
            epic:     0,
        }
    },
    {
        name: 'accessories',
        number: {
            common:   0,
            uncommon: 0,
            rare:     0,
            epic:     0,
        }
    },
];

const format = {
    width: 1024,
    height: 1024
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const frameCount = 8;

module.exports = { layersOrder, format, rarity, frameCount };