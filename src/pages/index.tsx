import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import prettyMs from 'pretty-ms'
import { useInterval } from '../hooks/useInterval'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import img from '../images/aot.jpeg'

dayjs.extend(utc)
dayjs.extend(timezone)

// Weeks are starting from monday
// https://github.com/iamkun/dayjs/issues/215#issuecomment-471280396
dayjs.Ls.en.weekStart = 1

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      zh: /zh-(cn|tw)/i.test(req.headers['accept-language'] || ''),
    },
  }
}

export default function HomePage({ zh }: { zh: boolean }) {
  const label = zh
    ? `距进击的巨人下一集更新还有:`
    : `The Next Episide of AOT Will Air In:`

  const tip = zh
    ? `根据中文字幕发布时间预估`
    : `Based on the release time of English Sub`

  const [now, setNow] = useState(dayjs().tz('Asia/Shanghai'))

  const prettyTime = useMemo(() => {
    const timeInThisWeek = now.startOf('week').add(2, 'hour')

    let remaining = 0
    if (now.isBefore(timeInThisWeek)) {
      remaining = timeInThisWeek.diff(now)
    } else {
      const timeInNextWeek = now.add(7, 'day').startOf('week').add(2, 'hour')
      remaining = timeInNextWeek.diff(now)
    }
    return prettyMs(remaining, {
      secondsDecimalDigits: 0,
    })
  }, [now])

  useInterval(() => {
    setNow(dayjs().tz('Asia/Shanghai'))
  }, 1000)

  const title = `When Will Attack on Titan's Next Episode Air?`
  const desc = `${label} ${prettyTime}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={img.src} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="text-center flex items-center h-screen justify-center">
        <div className="-mt-10">
          <h1 className="text-2xl">{label}</h1>
          <div className="mt-4 text-7xl font-bold">{prettyTime}</div>
          <div className="text-gray-300 mt-5 flex space-x-1 justify-center items-center text-xs">
            <span>
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <span>{tip}</span>
          </div>
        </div>
      </div>
    </>
  )
}
