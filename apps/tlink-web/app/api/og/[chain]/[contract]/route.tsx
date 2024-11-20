/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchTsData } from '@repo/tlinks/utils'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import sharp from 'sharp'

export const runtime = 'edge'

export async function GET(
  req: NextRequest,
  { params }: { params: { chain: string; contract: string } },
) {
  const interSemiBold = fetch(
    new URL('@/styles/Neue-Plak-Extended-SemiBold.woff', import.meta.url),
  ).then((res) => res.arrayBuffer())

  const { chain, contract } = params
  const tokenId = req.nextUrl.searchParams.get('tokenId')

  let scriptId: string | undefined | null =
    req.nextUrl.searchParams.get('scriptId')
  if (scriptId === 'undefined') {
    scriptId = undefined
  } else {
    scriptId = scriptId ? scriptId.split('_')[1] : undefined
  }

  const { tsMetadata, tokenMetadata } = await fetchTsData({
    chainId: Number(chain),
    contract,
    tokenId: tokenId ?? undefined,
    scriptId: scriptId ?? undefined,
  })

  const imgUrl = tokenMetadata?.image || tsMetadata?.meta.iconUrl || ''
  const title = tsMetadata?.name || tokenMetadata?.name
  const actionName = tsMetadata.actions[0].label

  let imgSrc: any
  console.log('11111111')
  try {
    imgSrc = await fetch(new URL(rewriteUrlIfIpfsUrl(imgUrl))).then((res) =>
      res.arrayBuffer(),
    )
    console.log('22222222')
    imgSrc = await sharp(imgSrc).toFormat('png').toBuffer()
    console.log('33333333')
  } catch (error) {
    console.log('44444444')
    // Create a 1x1 white pixel as fallback
    const whitePixel = new Uint8Array([255, 255, 255, 255]) // RGBA white pixel
    imgSrc = whitePixel.buffer
  }

  console.log('55555555')
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingLeft: '90px',
          paddingRight: '90px',
          backgroundImage: 'url(https://tlink-web.vercel.app/bg.png)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
            gap: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '600px',
            }}
          >
            <div
              style={{
                display: 'flex',
                color: 'white',
                fontSize: '66px',
                fontWeight: 600,
                marginBottom: '200px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {title}
                <div style={{ display: 'flex' }}>
                  With <span style={{ color: '#5EFF26' }}>TLinks</span>
                </div>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="231"
              height="41"
              fill="none"
              viewBox="0 0 231 41"
            >
              <g clipPath="url(#clip0_196_11222)">
                <path
                  fill="#fff"
                  d="M64.309 31.771q-2.83 0-4.748-.822-1.889-.852-2.892-2.191-.974-1.37-1.035-2.861a.62.62 0 0 1 .182-.457.62.62 0 0 1 .457-.183h2.71q.395 0 .578.183.213.152.365.396.182.577.7 1.156.518.549 1.4.913.913.366 2.283.366 2.191 0 3.257-.73 1.096-.731 1.096-1.98 0-.882-.579-1.4-.578-.548-1.796-.974-1.186-.456-3.165-.943-2.282-.548-3.836-1.309-1.521-.791-2.313-1.979-.76-1.186-.76-3.013 0-1.766.943-3.135.974-1.37 2.74-2.161 1.796-.792 4.26-.792 1.98 0 3.501.548 1.522.518 2.526 1.4 1.005.854 1.522 1.857.548.975.579 1.918a.7.7 0 0 1-.183.456q-.152.183-.456.183h-2.831a1.1 1.1 0 0 1-.487-.122q-.244-.12-.396-.456-.183-.944-1.187-1.614t-2.587-.67q-1.644 0-2.648.61-1.005.607-1.005 1.887 0 .852.487 1.43.518.549 1.613.974 1.126.427 2.953.914 2.587.578 4.23 1.339 1.645.761 2.405 1.948.762 1.156.762 2.953 0 2.008-1.096 3.44-1.065 1.399-3.014 2.16-1.947.76-4.535.761m10.824-.304a.7.7 0 0 1-.517-.213.7.7 0 0 1-.214-.518V16.37q0-.304.213-.517a.7.7 0 0 1 .518-.213h2.374q.304 0 .518.213a.7.7 0 0 1 .213.517v1.035q.639-.852 1.704-1.43 1.095-.61 2.588-.64 3.47-.06 4.84 2.71.7-1.218 2.008-1.949a5.9 5.9 0 0 1 2.953-.76q1.583 0 2.861.73 1.309.73 2.04 2.222.76 1.461.76 3.713v8.736a.7.7 0 0 1-.213.518.7.7 0 0 1-.517.213h-2.496a.7.7 0 0 1-.518-.213.7.7 0 0 1-.213-.518v-8.492q0-1.37-.395-2.161-.397-.822-1.066-1.157a3.3 3.3 0 0 0-1.491-.335q-.67 0-1.34.335-.669.335-1.095 1.157-.426.791-.426 2.16v8.493a.7.7 0 0 1-.214.518.7.7 0 0 1-.517.213h-2.496a.74.74 0 0 1-.548-.213.77.77 0 0 1-.183-.518v-8.492q0-1.37-.426-2.161-.426-.822-1.095-1.157a3.16 3.16 0 0 0-1.431-.335q-.7 0-1.37.365-.669.336-1.096 1.127-.426.791-.426 2.16v8.493a.7.7 0 0 1-.213.518.7.7 0 0 1-.517.213zm29.658.304q-1.583 0-2.862-.609-1.278-.639-2.039-1.674a4.1 4.1 0 0 1-.73-2.374q0-2.13 1.704-3.379 1.736-1.278 4.566-1.704l4.17-.609v-.64q0-1.276-.639-1.978-.64-.7-2.192-.7-1.095 0-1.796.457a2.65 2.65 0 0 0-1.004 1.157.78.78 0 0 1-.7.395h-2.405q-.335 0-.517-.182-.153-.183-.153-.488.032-.486.396-1.187.365-.7 1.157-1.339.79-.67 2.039-1.126 1.248-.457 3.014-.457 1.917 0 3.226.487 1.34.457 2.131 1.248a4.8 4.8 0 0 1 1.156 1.857q.366 1.065.366 2.253v9.557a.7.7 0 0 1-.213.518.7.7 0 0 1-.518.213h-2.465a.74.74 0 0 1-.548-.213.77.77 0 0 1-.183-.518V29.55q-.396.579-1.065 1.096-.67.488-1.644.822-.944.304-2.252.304m1.035-2.892q1.065 0 1.917-.456.883-.456 1.37-1.4.517-.974.517-2.435v-.64l-3.044.488q-1.796.273-2.678.882-.883.609-.883 1.492 0 .67.396 1.156.426.457 1.065.7.64.213 1.34.213m10.814 2.588a.7.7 0 0 1-.517-.213.7.7 0 0 1-.214-.518V16.4q0-.335.214-.548a.7.7 0 0 1 .517-.213h2.466q.303 0 .517.213a.7.7 0 0 1 .244.548v1.248a4.6 4.6 0 0 1 1.795-1.492q1.127-.517 2.588-.517h1.248q.334 0 .517.213a.7.7 0 0 1 .213.517v2.192a.7.7 0 0 1-.213.517q-.183.213-.517.213h-2.375q-1.461 0-2.282.822-.792.822-.792 2.253v8.37a.7.7 0 0 1-.213.518.74.74 0 0 1-.548.213zm17.441 0q-1.826 0-3.074-.64a4.08 4.08 0 0 1-1.857-1.887q-.609-1.278-.609-3.165v-6.91h-2.404a.7.7 0 0 1-.518-.213.7.7 0 0 1-.213-.517v-1.766q0-.304.213-.517a.7.7 0 0 1 .518-.213h2.404v-5.053q0-.305.183-.518a.74.74 0 0 1 .548-.213h2.465q.305 0 .518.213a.7.7 0 0 1 .213.518v5.053h3.805q.304 0 .517.213a.7.7 0 0 1 .213.517v1.766a.7.7 0 0 1-.213.517.7.7 0 0 1-.517.213h-3.805v6.605q0 1.248.426 1.949.457.7 1.552.7h2.101q.304 0 .517.213a.7.7 0 0 1 .213.517v1.887a.7.7 0 0 1-.213.518.7.7 0 0 1-.517.213zm10.6 0a.7.7 0 0 1-.518-.213.7.7 0 0 1-.213-.518V10.89q0-.304.213-.517a.7.7 0 0 1 .518-.213h2.83q.305 0 .518.213a.7.7 0 0 1 .213.517v16.955h9.649q.335 0 .548.213a.74.74 0 0 1 .213.548v2.13a.7.7 0 0 1-.213.518.74.74 0 0 1-.548.213zm19.483.304q-1.583 0-2.861-.609-1.28-.639-2.04-1.674a4.1 4.1 0 0 1-.73-2.374q0-2.13 1.704-3.379 1.736-1.278 4.566-1.704l4.17-.609v-.64q0-1.276-.639-1.978-.64-.7-2.192-.7-1.095 0-1.796.457a2.65 2.65 0 0 0-1.004 1.157.78.78 0 0 1-.7.395h-2.405q-.335 0-.517-.182-.152-.183-.152-.488.03-.486.395-1.187.365-.7 1.157-1.339.79-.67 2.039-1.126 1.248-.457 3.014-.457 1.917 0 3.226.487 1.34.457 2.131 1.248a4.8 4.8 0 0 1 1.157 1.857 6.9 6.9 0 0 1 .365 2.253v9.557a.7.7 0 0 1-.213.518.7.7 0 0 1-.518.213h-2.465a.74.74 0 0 1-.548-.213.77.77 0 0 1-.183-.518V29.55q-.396.579-1.065 1.096-.67.488-1.644.822-.944.304-2.252.304m1.035-2.892q1.065 0 1.917-.456.883-.456 1.37-1.4.517-.974.517-2.435v-.64l-3.043.488q-1.797.273-2.679.882t-.883 1.492q0 .67.396 1.156.426.457 1.065.7.64.213 1.34.213m12.529 8.371a.58.58 0 0 1-.426-.182.58.58 0 0 1-.183-.427v-.243q.03-.091.122-.244l2.374-5.63-5.844-13.79q-.122-.303-.122-.426a.74.74 0 0 1 .213-.456.58.58 0 0 1 .457-.213h2.465q.365 0 .548.182.183.183.274.396l4.048 9.954 4.17-9.954a.94.94 0 0 1 .274-.396q.183-.182.548-.182h2.435q.245 0 .426.182a.55.55 0 0 1 .214.426q0 .183-.122.488l-8.614 19.937a1.2 1.2 0 0 1-.305.396q-.182.182-.548.182zm19.196-5.479q-3.378 0-5.357-1.948-1.978-1.948-2.131-5.54a8 8 0 0 1-.03-.76q0-.487.03-.762.123-2.282 1.035-3.957.944-1.674 2.588-2.556 1.643-.915 3.865-.914 2.466 0 4.14 1.035 1.674 1.005 2.526 2.831.853 1.796.853 4.17v.64a.7.7 0 0 1-.213.517.74.74 0 0 1-.548.213h-10.106v.243q.03 1.065.396 1.979a3.6 3.6 0 0 0 1.126 1.43q.76.549 1.796.548.852 0 1.43-.243.58-.275.944-.609.366-.335.517-.548.274-.364.427-.426.182-.09.517-.091h2.618q.304 0 .487.182a.5.5 0 0 1 .182.457q-.03.487-.517 1.187-.457.7-1.339 1.37-.883.67-2.222 1.126-1.309.426-3.014.426m-3.348-9.588h6.727v-.091q0-1.188-.396-2.07a3.27 3.27 0 0 0-1.156-1.4q-.762-.518-1.827-.518t-1.826.518a3.28 3.28 0 0 0-1.157 1.4q-.365.882-.365 2.07zm13.154 9.284a.7.7 0 0 1-.517-.213.7.7 0 0 1-.214-.518V16.4q0-.335.214-.548a.7.7 0 0 1 .517-.213h2.466q.303 0 .517.213a.7.7 0 0 1 .244.548v1.248a4.6 4.6 0 0 1 1.795-1.492q1.127-.517 2.588-.517h1.248q.334 0 .517.213a.7.7 0 0 1 .213.517v2.192a.7.7 0 0 1-.213.517q-.183.213-.517.213h-2.375q-1.461 0-2.282.822-.792.822-.792 2.253v8.37a.7.7 0 0 1-.213.518.74.74 0 0 1-.548.213z"
                ></path>
                <rect
                  width="39.736"
                  height="39.736"
                  y="0.699"
                  fill="#001AFF"
                  rx="4.371"
                ></rect>
                <path
                  fill="#fff"
                  d="m33.379 25.944-13.51-7.881-13.511 7.88 13.51 7.881z"
                ></path>
                <path
                  fill="#3268FF"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeWidth="1.573"
                  d="m7.919 20.569 11.95-6.97 11.948 6.97-11.949 6.97z"
                ></path>
                <path
                  fill="#fff"
                  d="m33.379 14.467-13.51-7.881-13.511 7.88 13.51 7.882z"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_196_11222">
                  <path fill="#fff" d="M0 .7h230.4v39.735H0z"></path>
                </clipPath>
              </defs>
            </svg>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '400px',
              backgroundColor: '#15202B',
              height: '100%',
              padding: '20px 12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <img
                  src="https://tlink-web.vercel.app/smart-layer-logo.jpg"
                  style={{ width: '28px', height: '28px', borderRadius: '4px' }}
                  alt="logo"
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#F7F9F9',
                    }}
                  >
                    Smart Layer
                  </div>
                  <svg
                    style={{ width: '16px', height: '16px' }}
                    viewBox="0 0 22 22"
                  >
                    <linearGradient
                      id="37-a"
                      x1="4.411"
                      x2="18.083"
                      y1="2.495"
                      y2="21.508"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#f4e72a"></stop>
                      <stop offset="0.539" stopColor="#cd8105"></stop>
                      <stop offset="0.68" stopColor="#cb7b00"></stop>
                      <stop offset="1" stopColor="#f4ec26"></stop>
                      <stop offset="1" stopColor="#f4e72a"></stop>
                    </linearGradient>
                    <linearGradient
                      id="37-b"
                      x1="5.355"
                      x2="16.361"
                      y1="3.395"
                      y2="19.133"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#f9e87f"></stop>
                      <stop offset="0.406" stopColor="#e2b719"></stop>
                      <stop offset="0.989" stopColor="#e2b719"></stop>
                    </linearGradient>
                    <g fillRule="evenodd" clipRule="evenodd">
                      <path
                        fill="url(#37-a)"
                        d="M13.324 3.848 11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575 3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
                      ></path>
                      <path
                        fill="url(#37-b)"
                        d="M13.101 4.533 11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89 3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
                      ></path>
                      <path
                        fill="#d18800"
                        d="m6.233 11.423 3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z"
                      ></path>
                    </g>
                  </svg>
                  <span style={{ color: '#8A98A5' }}>@SmartLayer · 9h</span>
                </div>
              </div>
              <svg
                style={{
                  width: '16px',
                  height: '16px',
                  color: '#8A98A5',
                  fill: '#8A98A5',
                }}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#8A98A5"
                  d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2m9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2"
                ></path>
              </svg>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #467788',
                  backgroundColor: '#020216',
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    padding: '16px 16px 0 16px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      display: 'flex',
                    }}
                  >
                    <img
                      style={{
                        height: '342px',
                        width: '342px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        opacity: 1,
                        transition: 'opacity 300ms',
                      }}
                      width="342"
                      height="342"
                      src={imgSrc}
                      alt="action-image"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: '#76777B',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ marginRight: '8px', flexShrink: 0 }}
                      >
                        <g fill="currentColor" clipPath="url(#a)">
                          <path d="M7.409 9.774 9.774 7.41a.836.836 0 1 0-1.183-1.183L6.226 8.592A.836.836 0 1 0 7.41 9.774Z"></path>
                          <path d="M10.76.503A4.709 4.709 0 0 0 7.41 1.889L5.83 3.467A.836.836 0 1 0 7.014 4.65L8.59 3.072a3.067 3.067 0 0 1 4.338 4.337L11.35 8.987a.835.835 0 1 0 1.182 1.182l1.578-1.577a4.738 4.738 0 0 0-3.35-8.09ZM5.24 15.497a4.706 4.706 0 0 0 3.351-1.386l1.578-1.577a.836.836 0 1 0-1.182-1.183l-1.578 1.578a3.067 3.067 0 1 1-4.337-4.337L4.65 7.014A.836.836 0 1 0 3.467 5.83L1.889 7.41a4.737 4.737 0 0 0 3.351 8.088Z"></path>
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path fill="#fff" d="M0 0h16v16H0z"></path>
                          </clipPath>
                        </defs>
                      </svg>
                      <span
                        style={{
                          color: '#76777B',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'colors',
                        }}
                      >
                        link.to.token
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      color: 'white',
                      fontWeight: 600,
                      marginBottom: '16px',
                    }}
                  >
                    {title}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexGrow: 1,
                        }}
                      >
                        <button
                          style={{
                            color: 'black',
                            borderRadius: '9999px',
                            height: '32px',
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            whiteSpace: 'nowrap',
                            padding: '12px 16px',
                            fontWeight: 600,
                            backgroundColor: '#5EFF26',
                          }}
                        >
                          <span
                            style={{
                              minWidth: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {actionName}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    color: '#8A98A5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>
                    <svg
                      style={{ width: '16px', height: '16px' }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#8A98A5"
                        d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366a8.13 8.13 0 0 1 8.129 8.13c0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067A8.005 8.005 0 0 1 1.751 10m8.005-6a6.005 6.005 0 1 0 .133 12.01l.351-.01h1.761v2.3l5.087-2.81A6.127 6.127 0 0 0 14.122 4z"
                      ></path>
                    </svg>
                  </span>
                  <span>131</span>
                </div>

                <div
                  style={{
                    color: '#8A98A5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>
                    <svg
                      style={{ width: '16px', height: '16px' }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#8A98A5"
                        d="m4.5 3.88 4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5a4 4 0 0 1-4-4V7.55L1.432 9.48.068 8.02zM16.5 6H11V4h5.5a4 4 0 0 1 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2"
                      ></path>
                    </svg>
                  </span>
                  <span>47</span>
                </div>

                <div
                  style={{
                    color: '#8A98A5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>
                    <svg
                      style={{ width: '16px', height: '16px' }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#8A98A5"
                        d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                      ></path>
                    </svg>
                  </span>
                  <span>675</span>
                </div>

                <div
                  style={{
                    color: '#8A98A5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>
                    <svg
                      style={{ width: '16px', height: '16px' }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#8A98A5"
                        d="M8.75 21V3h2v18zM18 21V8.5h2V21zM4 21l.004-10h2L6 21zm9.248 0v-7h2v7z"
                      ></path>
                    </svg>
                  </span>
                  <span>2M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}

function rewriteUrlIfIpfsUrl(url: string) {
  if (!url) {
    return ''
  } else if (url.toLowerCase().startsWith('https://ipfs.io/ipfs')) {
    return url.replace(
      'https://ipfs.io/ipfs',
      'https://gateway.pinata.cloud/ipfs',
    )
  } else if (url.toLowerCase().startsWith('ipfs://ipfs')) {
    return url.replace('ipfs://ipfs', 'https://gateway.pinata.cloud/ipfs')
  } else if (url.toLowerCase().startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
  }
  return url
}
