const routes = [
  {
    label: "Mot Stockholm C",
    siteId:  "9732",
    line: "43",
    direction: "2",
  },
  {
    label: "Mot Trångsund",
    siteId: "1080",
    line: "43",
    direction: "1",
  },
];

// Light-Mode 1st, Dark-Mode 2nd
const colors = {
  widgetBg: Color.dynamic(
    new Color("#EAECED"),
    new Color("#22262C")
  ),
  cellBackgroundColor: Color.dynamic(
    new Color("#D0D2D4"),
    new Color("#3C4044")
  ),
  update: Color.dynamic(
    new Color("#676767"),
    new Color("#A1A1A6")
  ),
  labelTextColor: Color.dynamic(
    new Color("#00204F"),
    new Color("#88C4C9")
  ),
  cellTextColor: Color.dynamic(
    new Color("#212121"),
    new Color("#FFFFFF")
  ),
};

const widget = new ListWidget();
widget.backgroundColor = colors.widgetBg;

 /*
  return [
    "https://maps.googleapis.com/maps/api/directions/json",
    `?origin=${encodeURIComponent(origin)}`,
    `&destination=${encodeURIComponent(destination)}`,
    "&mode=transit",
    "&transit_mode=rail",
    "&transit_routing_preference=fewer_transfers",
    "&alternatives=true",
    `&key=${GOOGLE_MAPS_API_KEY}`,
  ].join("");*/

function composeGoogleMapsRequestUrl(siteId, line, direction) {
  return [
    "https://transport.integration.sl.se/v1/sites/" + siteId + "/departures",
    "?transport=TRAIN",
    "&direction=" + direction,
    "&line=" + line,
    "&forecast=60"
  ].join("");
}

async function getStopData(siteId, line, direction) {
  const url = composeGoogleMapsRequestUrl(siteId, line, direction);
  const req = new Request(url);
  return await req.loadJSON();
}

function getStopTimes(stopData) {
  const routeTimes = stopData.departures.map((departure) => {
    console.log(departure);
    return departure.expected;
  });

  return routeTimes;
}

function createRouteScheduleStack(stopTimes, color, label) {
  let scheduleLabel = widget.addText(label);
  scheduleLabel.textColor = colors.labelTextColor;
  scheduleLabel.font = Font.boldSystemFont(14);
  scheduleLabel.lineLimit = 1;

  let row = widget.addStack();
  row.layoutHorizontally()
  
  row.setPadding(4, 0, 0, 0);
  row.spacing =3;

  stopTimes.forEach((time, idx) => {
    let cell = row.addStack();
    cell.backgroundColor = colors.cellBackgroundColor;
    cell.setPadding(2, 3, 2, 3);
    cell.cornerRadius = 4;

    const formatted = new Date(time);
    time = formatted.toLocaleTimeString();

    let cellText = cell.addText(time.substring(0,5));
    cellText.font = Font.mediumSystemFont(12);
    cellText.lineLimit = 1;
    cell.widthWeight = idx;

    cellText.textColor = colors.cellTextColor;
    

    // Add some spacing to the right of each cell


    widget.addStack(row);
  });
}

let i = 0;
let len = routes.length;

for (i; i < len; i++) {
  const route = routes[i];
  const {label, siteId,line, direction} = route;
  const color = colors.cellBackgroundColor;

  const stopData = await getStopData(siteId, line, direction);
  const stopTimes = getStopTimes(stopData);
  log(stopTimes);
  createRouteScheduleStack(
    stopTimes,
    color,
    route.label
  );

  widget.addSpacer();
}

let lastUpdatedAt =
  "Last updated " + new Date().toLocaleTimeString();
const lastUpdatedAtText = widget.addText(lastUpdatedAt);
lastUpdatedAtText.textColor = colors.updated;
lastUpdatedAtText.font = Font.lightSystemFont(8);

// Every 10 minutes
const now = Date.now();
widget.refreshAfterDate = new Date(now + 1000 * 60 * 10);

Script.setWidget(widget);
Script.complete();

widget.presentSmall();
