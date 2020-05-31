import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const noDisplay = {display: false};

const scaleAxes = {
  gridLines: noDisplay,
  ticks: {
    beginAtZero: true,
    fontSize: 16,
  },
};

const makeOptions = ({types, values, title, formatter}) => ({
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  fontSize: 14,
  data: {
    labels: types,
    datasets: [{
      data: values,
      backgroundColor: `#ffffff`,
      minBarLength: 70,
    }]
  },
  options: {
    layout: {
      padding: {
        left: 90,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      xAxes: [Object.assign({}, scaleAxes, noDisplay)],
      yAxes: [scaleAxes],
    },
    legend: noDisplay,
    title: {
      display: true,
      text: title,
      fontSize: 20,
    },
    tooltips: {
      enabled: false,
    },
    plugins: {
      datalabels: {
        font: {
          size: 16,
        },
        anchor: `end`,
        align: `left`,
        formatter,
      }
    },
  }
});

export const makeChart = (element, options = {}) =>
  new Chart(element, makeOptions(options));
