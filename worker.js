const TARGETS = {
  "www.raclettelovers.cz": "https://raclettelovers.cz",
  "www.raclettelovers.sk": "https://raclettelovers.sk",
  "www.raclettelovers.ch": "https://raclettelovers.ch",
  "raclette-lovers.com": "https://www.raclettelovers.com",
  "www.raclette-lovers.com": "https://www.raclettelovers.com",
  "raclette-point-original.com": "https://www.raclettelovers.com",
  "www.raclette-point-original.com": "https://www.raclettelovers.com",
  "raclettepointoriginal.com": "https://www.raclettelovers.com",
  "www.raclettepointoriginal.com": "https://www.raclettelovers.com",
  "raclettepointoriginal.cz": "https://raclettelovers.cz",
  "www.raclettepointoriginal.cz": "https://raclettelovers.cz",
  "raclettepointoriginal.sk": "https://raclettelovers.sk",
  "www.raclettepointoriginal.sk": "https://raclettelovers.sk",
  "raclettepointoriginal.ch": "https://raclettelovers.ch",
  "www.raclettepointoriginal.ch": "https://raclettelovers.ch",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = TARGETS[url.hostname];
    if (target) {
      return Response.redirect(target + url.pathname + url.search, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
