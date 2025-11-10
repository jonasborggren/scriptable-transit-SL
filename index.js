const routes = [
  {
    label: "Till Stockholm C",
    name: "Västerhaninge",
    lines: [42,43],
    direction: 2,
  },
  {
    label: "Till Västerhaninge",
    name: "Stockholm City",
    lines: [42,43],
    direction: 1,
  },
];

// Light-Mode 1st, Dark-Mode 2nd
const colors = {
  widgetBg: Color.dynamic(
    new Color("#EAECED"), 
    new Color("#22262C")
  ),
  labelTextColor: Color.dynamic(
    new Color("#00204F"), 
    new Color("#88C4C9")
  ),
  update: Color.dynamic(
    new Color("#676767"), 
    new Color("#A1A1A6")
  ),
  cellBackgroundColor: Color.dynamic(
    new Color("#D0D2D4"), 
    new Color("#3C4044")
  ),
  cellTextColor: Color.dynamic(
    new Color("#212121"), 
    new Color("#ffffff")
  ),
  atStop: Color.dynamic(
    new Color("#FFA500"), 
    new Color("#FFA500")
  ),
  onAtStop: Color.dynamic(
    new Color("#000000"), 
    new Color("#000000")
  ),
  cancelled: null,
  onCancelled: Color.dynamic(
    new Color("#777777"), 
    new Color("#777777")
  ),
  late: Color.dynamic(
    new Color("#d6cf26"),
    new Color("#d6cf26"),
  ),
  onLate: Color.dynamic(
    new Color("#000000"), 
    new Color("#000000")
  ),
};

const widget = new ListWidget();
widget.backgroundColor = colors.widgetBg;

async function getStopData(name, lines, direction) {
  const sitesReq = new Request("https://transport.integration.sl.se/v1/sites");
  const sitesJson = await sitesReq.loadJSON();
  const result = sitesJson.find((e) => e.name === name);
  const id = result.id;
  const linesJson = [];

  for (let line of lines) {
    const url = [
      "https://transport.integration.sl.se/v1",
      `/sites/${id}/departures`,
      `?transport=TRAIN&direction=${direction}&line=${line}&forecast=480`
    ].join("");
    const req = new Request(url);
    const json = await req.loadJSON();
//     console.log(json);
    linesJson.push(json);
  }
  return linesJson;
}

function getStopTimes(stopData)
{
    return stopData.map((e) => e.departures).flatMap((departures) => departures.map((departure) => [
        departure.expected,
        departure.state,
        departure.line.designation
    ])).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(0,3);
}

function createRouteScheduleStack(stopTimes, label) {
  const scheduleLabel = widget.addText(label);
  scheduleLabel.textColor = colors.labelTextColor;
  scheduleLabel.font = Font.boldSystemFont(14);
  scheduleLabel.lineLimit = 1;

  const row = widget.addStack();
  row.layoutHorizontally();
  row.setPadding(4, 0, 0, 0);
  row.spacing = 3;

  stopTimes.forEach((data) => {
    let [time, state, designation] = data;
    const cell = row.addStack();
    let cellColor, cellTextColor;
    console.log(time );
    console.log(state);
    console.log(designation);

    switch (state) {
      case "BOARDING":
      case "BOARDINGCLOSED":
      case "AT_STOP":
        cellColor = colors.atStop;
        cellTextColor = colors.onAtStop;
        break;
      case "NOTEXPECTED":
        cellColor = colors.late;
        cellTextColor = colors.onLate;
        break;
      case "CANCELLED":
        cellColor = colors.cancelled;
        cellTextColor = colors.onCancelled;
        break;
      default:
        cellColor = colors.cellBackgroundColor;
        cellTextColor = colors.cellTextColor;
        break;
    }

    cell.backgroundColor = cellColor;
    cell.setPadding(2, 3, 2, 3);
    cell.cornerRadius = 4;
    
if (designation.includes("X")) {
  const xMark = cell.addText("X");
  xMark.font = Font.boldSystemFont(11.5);
  xMark.textColor = new Color("#FF000080"); // transparent red
  xMark.centerAlignText();
}


    const formattedTime = new Date(time).toLocaleTimeString();
    let timeText = formattedTime.substring(0, 5);
    let text = timeText;
    console.log(text);
    const cellText = cell.addText(text);
    cellText.font = Font.mediumSystemFont(11.5);
    cellText.lineLimit = 1;
    cellText.textColor = cellTextColor;
    
  });

  widget.addStack(row);
}

(async () => {
  for (let route of routes) {
    const { label, name, lines, direction } = route;
    const stopData = await getStopData(name, lines, direction);
    const stopTimes = getStopTimes(stopData);
    createRouteScheduleStack(stopTimes, label);
    widget.addSpacer();
  }

  const lastUpdatedAt = "Last updated " + new Date().toLocaleTimeString();
  const lastUpdatedAtText = widget.addText(lastUpdatedAt);
  lastUpdatedAtText.textColor = colors.update;
  lastUpdatedAtText.font = Font.lightSystemFont(8);

  // Every minute
  const now = Date.now();
  widget.refreshAfterDate = new Date(now + 1000 * 60);

  Script.setWidget(widget);
  Script.complete();

  widget.presentSmall();
})();