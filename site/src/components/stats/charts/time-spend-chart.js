import {BAR_HEIGHT, ChartValues, tripPointIconMap} from '../../../helpers/const.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export const timeSpendChart = (ctx, data) => {
  const dataKeys = Object.keys(data);
  ctx.height = BAR_HEIGHT * dataKeys.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataKeys.map((label) => `${tripPointIconMap[label]} ${label.toUpperCase()}`),
      datasets: [{
        data: Object.values(data),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: ChartValues.BAR_THICKNESS,
        minBarLength: ChartValues.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          fontSize: ChartValues.LABELS_FONT_SIZE,
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val} H`
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
        fontColor: `#000000`,
        fontSize: ChartValues.TITLE_FONT_SIZE,
        position: `left`
      },
      layout: {
        padding: {
          left: ChartValues.LAYOUT_PADDING_LEFT,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: ChartValues.SCALES_Y_PADDING,
            fontSize: ChartValues.SCALES_Y_FONTSIZE,
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
