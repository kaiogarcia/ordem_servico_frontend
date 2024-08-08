import React, { useEffect } from 'react'
import 'amcharts3/amcharts/amcharts'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/themes/light'
import AmCharts from '@amcharts/amcharts3-react'

const AmChartStatistics6 = (props) => {
  useEffect(() => {
    AmCharts.makeChart('bar-chart2', {
      type: 'serial',
      theme: 'light',
      marginTop: 10,
      marginRight: 0,
      valueAxes: [
        {
          id: 'v1',
          position: 'left',
          axisAlpha: 0,
          lineAlpha: 0,
          autoGridCount: false,
          labelFunction: function (value) {
            return +Math.round(value) + '00'
          },
        },
      ],
      graphs: [
        {
          id: 'g1',
          valueAxis: 'v1',
          lineColor: ['#1de9b6', '#1dc4e9'],
          fillColors: ['#1de9b6', '#1dc4e9'],
          fillAlphas: 1,
          type: 'column',
          title: 'RECEITAS',
          valueField: 'incomes',
          columnWidth: 0.3,
          legendValueText: 'R$ [[value]]',
          balloonText:
            "[[title]]<br /><b style='font-size: 130%'>R$ [[value]]</b>",
        },
        {
          id: 'g2',
          valueAxis: 'v1',
          lineColor: ['#DC143C', '#DC143C'],
          fillColors: ['#DC143C', '#DC143C'],
          fillAlphas: 1,
          type: 'column',
          title: 'DESPESAS EMPRESA',
          valueField: 'expenses',
          columnWidth: 0.3,
          legendValueText: 'R$ [[value]]',
          balloonText:
            "[[title]]<br /><b style='font-size: 130%'>R$ [[value]]</b>",
        },
        {
          id: 'g3',
          valueAxis: 'v1',
          lineColor: ['#FA8072', '#FA8072'],
          fillColors: ['#FA8072', '#FA8072'],
          fillAlphas: 1,
          type: 'column',
          title: 'DESPESAS PESSOAIS ',
          valueField: 'personal_expenses',
          columnWidth: 0.3,
          legendValueText: 'R$ [[value]]',
          balloonText:
            "[[title]]<br /><b style='font-size: 130%'>R$ [[value]]</b>",
        },
        {
          id: 'g4',
          valueAxis: 'v1',
          lineColor: ['#32CD32', '#32CD32'],
          fillColors: ['#32CD32', '#32CD32'],
          fillAlphas: 1,
          type: 'column',
          title: 'LUCRO',
          valueField: 'profit',
          columnWidth: 0.3,
          legendValueText: 'R$ [[value]]',
          balloonText:
            "[[title]]<br /><b style='font-size: 130%'>R$ [[value]]</b>",
        },
      ],
      chartCursor: {
        pan: true,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        cursorAlpha: 0,
        valueLineAlpha: 0.2,
      },
      categoryField: 'month',
      categoryAxis: {
        dashLength: 1,
        gridAlpha: 0,
        axisAlpha: 0,
        lineAlpha: 0,
        minorGridEnabled: true,
      },
      // legend: {
      //   useGraphSettings: true,
      //   position: 'top',
      // },
      // Configuração do numberFormatter
      numberFormatter: {
        decimalSeparator: ',',
        thousandsSeparator: '.',
        precision: 2,
        decimalPlaces: 2,
        usePrefixes: true,
        prefixesOfBigNumbers: [
          { number: 1e3, prefix: 'mil' },
          { number: 1e6, prefix: 'milhões' },
          { number: 1e9, prefix: 'bilhões' },
        ],
      },
      balloon: {
        borderThickness: 1,
        shadowAlpha: 0,
      },
      dataProvider: props.dataChart,
    })
  })

  return (
    <div
      id="bar-chart2"
      className="bar-chart2"
      style={{ width: '100%', height: props.height }}
    />
  )
}

export default AmChartStatistics6
