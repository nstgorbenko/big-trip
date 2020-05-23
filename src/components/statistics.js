import AbstractComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {eventTypeToEmoji} from "../dict.js";
import {HIDDEN_CLASS, TRANSFER_EVENTS} from "../const.js";
import {getDuration} from "../utils/date.js";
import moment from "moment";

const BAR_HEIGHT = 55;
const ChartName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPEND`
};
const MIN_CHART_HEIGHT = 110;

const getEmojiType = (type) => eventTypeToEmoji[type] || ``;

const getChartData = (tripData, callback) => {
  return tripData.reduce((types, tripEvent) => {
    const tripTypeName = `${getEmojiType(tripEvent.type)} ${tripEvent.type.toUpperCase()}`;
    if (!types.hasOwnProperty(tripTypeName)) {
      types[tripTypeName] = 0;
    }
    types[tripTypeName] += callback(tripEvent);

    return types;
  }, {});
};

const renderChart = (chartCtx, chartData, chartTitle, labelView) => {
  const types = Object.keys(chartData).sort((a, b) => chartData[b] - chartData[a]);
  const values = types.map((type) => chartData[type]);

  switch (types.length) {
    case 0:
      chartCtx.classList.add(HIDDEN_CLASS);
      return null;
    case 1:
      chartCtx.height = MIN_CHART_HEIGHT;
      break;
    default:
      chartCtx.height = types.length * BAR_HEIGHT;
  }

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: values,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 70
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
            weight: `bold`
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: labelView
        }
      },
      title: {
        display: true,
        text: chartTitle,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
            fontStyle: `bold`
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(tripEvents) {
    super();
    this._tripEvents = tripEvents;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();
    const tripEvents = this._tripEvents;
    const tripTransportEvents = tripEvents.filter(({type}) => TRANSFER_EVENTS.indexOf(type) > 0);

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    const moneyData = getChartData(tripEvents, (tripEvent) => tripEvent.basePrice);
    const transportData = getChartData(tripTransportEvents, () => 1);
    const timeData = getChartData(tripEvents, (tripEvent) => moment.duration(tripEvent.end - tripEvent.start));

    this._resetCharts();

    this._moneyChart = renderChart(moneyCtx, moneyData, ChartName.MONEY, (value) => `€ ${value}`);
    this._transportChart = renderChart(transportCtx, transportData, ChartName.TRANSPORT, (value) => `${value}x`);
    this._timeChart = renderChart(timeCtx, timeData, ChartName.TIME, (value) => `${getDuration(value)}`);
  }

  _resetChart(chart) {
    if (chart !== null) {
      chart.destroy();
      chart = null;
    }
  }

  _resetCharts() {
    this._resetChart(this._moneyChart);
    this._resetChart(this._transportChart);
    this._resetChart(this._timeChart);
  }
}
