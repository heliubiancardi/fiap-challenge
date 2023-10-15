import { useState } from 'react'
import './app.scss'
import { evaluate } from './services'
import Mock from './mock.json'
import { ReplayRounded, SendRounded, SentimentDissatisfiedRounded, SentimentNeutralRounded, SentimentVerySatisfiedRounded } from '@mui/icons-material';

const colors = {
  'positivo': '#27625c',
  'neutro': '#ad9a67',
  'negativo': '#a9513f'
}

const sentimentConfig = {
  'positivo': {
    icon: <SentimentVerySatisfiedRounded sx={{ color: colors.positivo }}/>,
    color: colors.positivo
  },
  'neutro': {
    icon: <SentimentNeutralRounded sx={{ color: colors.neutro }}/>,
    color: colors.neutro
  },
  'negativo': {
    icon: <SentimentDissatisfiedRounded sx={{ color: colors.negativo }} />,
    color: colors.negativo
  }
}

const orderedFeelings = ["positivo", "neutro", "negativo"]

const App = () => {
  const [text, setText] = useState()
  const [result, setResult] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    Mock['major'] = getMajorSentiment(Mock.sentimentos)

    evaluate({ input: text }).then((response) => {
      response.data['major'] = getMajorSentiment(response.data.sentimentos)
      setResult(response.data)
      setIsLoading(false)
    })
  }

  const clearAll = () => {
    setResult(null)
    setText(null)
  }

  const onChange = (e) => {
    setText(e.target.value)
  }

  const share = () => {
    const message = `
*Veja o resultado que a IA da Fiap me retornou:*
  
- "${text}"


*Resultado:*

Positivo: ${ result?.sentimentos.find(x => x.sentiment.toLowerCase() === 'positivo')?.percent ?? 0 }%
Neutro: ${ result?.sentimentos.find(x => x.sentiment.toLowerCase() === 'neutro')?.percent ?? 0 }%
Negativo: ${ result?.sentimentos.find(x => x.sentiment.toLowerCase() === 'negativo')?.percent ?? 0 }%


*Principais Tópicos Identificados:*

${result.principaisTermos.join(", ")}


*Temas Sugeridos:*

${result.temasSugeridos.map(tema => "* " + tema).join("\n")}


_API desenvolvida por alunos do grupo 13 GTI Fiap_.
    `;

    const whatsappURL = "https://web.whatsapp.com/send?text=" + encodeURIComponent(message);
    window.open(whatsappURL, '_blank');
  }

  const getMajorSentiment = (feelings) => {
    return feelings.reduce((accumulator, feeling) => {
      return feeling.percent > accumulator.percent ? feeling : accumulator
    }, {
      'sentiment': 'Nenhum',
      'percent': '0'
    })
  }

  return (
    <>
      { !result &&
        <form onSubmit={onSubmit}>
          <textarea value={text} onChange={onChange} required></textarea>
          { isLoading ? <div className="lds-dual-ring"></div> : <button>Avaliar</button> }
        </form>
      }
      { result &&
        <div className="result">
          <button className="reload" onClick={() => clearAll()}><ReplayRounded /></button>
          <button className="share" onClick={() => share()}><SendRounded /></button>
          <div className="sentiment">
            <h3 className="title">Sentimento</h3>
            <div className="content">
              <div className="major">
                {sentimentConfig[result.major.sentiment.toLowerCase()].icon}
                <div className="description">
                  Sentimento predominante: <div style={{ color: sentimentConfig[result.major.sentiment.toLowerCase()].color }}>{result.major.sentiment.toUpperCase()}</div>
                </div>
              </div>
              <div className="feelings">
                <ul>
                  {
                    orderedFeelings.map((orderedFeeling) => {
                      const feeling = result.sentimentos.find(x => x.sentiment.toLowerCase() === orderedFeeling)
                      return (
                        <li key={orderedFeeling}>
                          {sentimentConfig[orderedFeeling].icon}
                          <div className="bar" style={{ width: `${feeling?.percent ?? 0}%`, backgroundColor: sentimentConfig[orderedFeeling].color }}>
                            {orderedFeeling.toUpperCase()}
                          </div>
                          <div className="percent" style={{ color: sentimentConfig[orderedFeeling].color }}>{feeling?.percent ?? 0}%</div>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="text">
            <h3 className="title">Texto Analisado</h3>
            <p className="content">
              {text}
            </p>
            <div className="key-terms">
              <div className="title">Principais Termos</div>
              <ul>
                {
                  result.principaisTermos.map((term) => (
                    <li key={term}>{term}</li>
                  ))
                }
              </ul>
            </div>
            <div className="suggested-topics">
              <h4 className="title">Temas Sugeridos</h4>
              <ul>
                {
                  result.temasSugeridos.map((term) => (
                    <li key={term}>{term}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default App
