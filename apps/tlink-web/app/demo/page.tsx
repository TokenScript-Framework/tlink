/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
/* eslint-disable @next/next/no-img-element */
import { ActionConfig, ActionContainer, useAction } from '@repo/tlinks'
import '@repo/tlinks/index.css'
import React from 'react'

const Page: React.FC = () => {
  const { action } = useAction({
    url: 'https://viewer.tokenscript.org/?chain=8453&contract=0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a&scriptId=7738_2#card=Info&tokenId=109541814075604622605202872494250821275866922285415705885847926644579782560125',
    adapter: new ActionConfig({
      signTransaction: () => {},
      connect: () => {},
      getConnectedAccount: () => {},
      metadata: {},
    } as any),
  })
  console.log('action', action)

  return (
    <main className="mx-auto mt-32 flex min-h-screen w-full max-w-[1440px] flex-col justify-between gap-10 px-4 pb-40 md:flex-row md:px-8">
      <div className="mx-auto flex min-h-screen flex-col justify-between gap-10 md:flex-row">
        <div className="w-full md:max-w-[25rem]">
          <aside className="flex flex-col gap-6">
            <ProfileCard />
            <SocialLinks />
            <SkillsList />
          </aside>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#EBEBEB] p-4 shadow-lg sm:gap-8 sm:p-8 md:gap-10 md:p-10 lg:gap-12 lg:p-12">
            <section>
              <div className="flex flex-row justify-between">
                <h3 className="flex items-baseline text-lg font-medium md:items-center">
                  <span className="inline-block align-middle text-blue-600">
                    <svg
                      width={24}
                      height="0.75rem"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <circle cx="7.5" cy="7.5" r="7.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span>Frames</span>
                </h3>
              </div>
              <div className="columns-1 p-4 xl:columns-2">
                {action && (
                  <div className="min-w-96">
                    <ActionContainer
                      action={action}
                      websiteUrl="https://x.com/ddwchen"
                      websiteText="ddwchen"
                    />
                  </div>
                )}

                <div></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page

const ProfileCard: React.FC = () => {
  return (
    <div className="bg-blue-500 w-fit-content mx-auto text-white relative leading-[2em] overflow-hidden text-ellipsis max-w-full shadow-[0px_8px_16px_0px_rgba(0,82,255,0.32),inset_0px_8px_16px_0px_rgba(255,255,255,0.25)] transition-all duration-700 ease-in-out rounded-[2rem] py-8 px-10 pt-40 w-full">
      <figure className="flex items-center justify-center overflow-hidden rounded-full absolute transition-all duration-700 ease-in-out h-[3rem] w-[3rem] top-10 left-10">
        <img
          src="https://green-secure-toad-311.mypinata.cloud/ipfs/bafkreibpol5u5qsr7brfkgfnjpdbegdle323hdbx4krwf4ai2cr5zhytn4"
          className="transition-all duration-200 object-cover w-full h-full opacity-100"
          alt="treegirl.base.eth"
          title="treegirl.base.eth"
          width={64}
          height={64}
        />
      </figure>
      <span className="overflow-y-hidden text-ellipsis whitespace-nowrap transition-all duration-700 ease-in-out text-3xl pl-0 mt-20">
        treegirl.base.eth
      </span>
      <div className="absolute right-4 top-4">
        <div>
          <span>
            <span className="inline-block p-2 opacity-50 hover:opacity-100">
              <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.4199 7.52002L11.9999 14.94L4.57994 7.52002L2.80994 9.29002L11.9999 18.48L21.1899 9.29002L19.4199 7.52002Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

const SkillsList: React.FC = () => {
  return (
    <div>
      <h2 className="font-bold uppercase text-[#5B616E]">Skills</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        <li>
          <span className="flex items-center gap-2 rounded-xl border  px-3 py-2 text-sm font-bold transition-all border-[#45E1E5] bg-[#45E1E5]/20 text-[#004774]">
            Marketing
          </span>
        </li>
        <li>
          <span className="flex items-center gap-2 rounded-xl border  px-3 py-2 text-sm font-bold transition-all border-[#45E1E5] bg-[#45E1E5]/20 text-[#004774]">
            Strategy
          </span>
        </li>
        <li>
          <span className="flex items-center gap-2 rounded-xl border  px-3 py-2 text-sm font-bold transition-all border-[#F8BDF5] bg-[#F8BDF5]/20 text-[#741A66]">
            Writing
          </span>
        </li>
        <li>
          <span className="flex items-center gap-2 rounded-xl border  px-3 py-2 text-sm font-bold transition-all border-[#45E1E5] bg-[#45E1E5]/20 text-[#004774]">
            Community
          </span>
        </li>
      </ul>
    </div>
  )
}

const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-40/20 p-8">
      <p className="break-words font-bold text-illoblack">
        experimenting onchain at rehashweb3.xyz
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <a
            target="_blank"
            className="flex items-center gap-2 text-palette-foregroundMuted hover:text-blue-500"
            href="https://x.com/ddwchen"
          >
            <span>
              <svg
                width="1rem"
                height="1rem"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.0979642 0.136564C0.151854 0.211665 1.39988 1.9859 2.87137 4.0793C4.34285 6.17269 5.70383 8.10863 5.89579 8.38141C6.08774 8.65419 6.24478 8.88284 6.24478 8.88953C6.24478 8.89623 6.1733 8.98231 6.08595 9.08081C5.99859 9.17931 5.75253 9.45815 5.53917 9.70044C5.3258 9.94273 4.96611 10.3511 4.73985 10.6079C4.51361 10.8648 4.11558 11.3167 3.85534 11.6123C3.59511 11.9079 3.12714 12.4394 2.8154 12.7933C1.85126 13.888 1.71212 14.0461 0.978182 14.8811C0.586289 15.3269 0.210488 15.7531 0.143086 15.8283C0.0756833 15.9035 0.020531 15.9729 0.020531 15.9825C0.020531 15.9938 0.266687 16 0.714057 16H1.40757L2.17001 15.1322C2.58936 14.6548 3.00303 14.185 3.08927 14.0881C3.27576 13.8786 4.69796 12.2623 4.8175 12.1241C4.86327 12.0711 4.92975 11.9958 4.96524 11.9567C5.00075 11.9175 5.28055 11.6 5.58703 11.2511C5.8935 10.9022 6.15268 10.6082 6.16295 10.5977C6.17323 10.5873 6.33548 10.4029 6.5235 10.1881C6.71153 9.97318 6.87118 9.79736 6.87827 9.79736C6.88538 9.79736 7.85124 11.1632 9.02466 12.8326C10.1981 14.502 11.1791 15.8974 11.2047 15.9335L11.2512 15.9992L13.6301 15.9996C15.5864 15.9999 16.0074 15.9959 15.9999 15.9769C15.992 15.9566 14.8522 14.3329 11.9283 10.1762C9.82332 7.18386 9.54342 6.78174 9.55145 6.76134C9.55925 6.7415 9.84596 6.41397 11.7309 4.27167C12.0542 3.90419 12.4999 3.39736 12.7213 3.14537C12.9428 2.89339 13.1663 2.63965 13.2181 2.5815C13.27 2.52335 13.5424 2.2141 13.8236 1.89427C14.1048 1.57445 14.5828 1.03101 14.8859 0.686643C15.1889 0.342273 15.448 0.0469077 15.4616 0.0302557C15.4849 0.0017623 15.4453 0 14.7819 0H14.0775L13.7642 0.356828C13.3472 0.831718 12.5934 1.68809 12.3794 1.93008C12.2848 2.037 12.1668 2.17138 12.1172 2.22869C12.0676 2.28599 11.9697 2.39674 11.8997 2.4748C11.8297 2.55286 11.4768 2.95374 11.1155 3.36564C10.7543 3.77753 10.4538 4.1185 10.4477 4.12335C10.4416 4.12819 10.3642 4.21589 10.2757 4.31825C10.1208 4.49729 9.96312 4.67649 9.24013 5.49542C8.92278 5.85489 8.90651 5.87033 8.87976 5.83729C8.86437 5.81825 7.93435 4.49715 6.81309 2.90152L4.77442 0.000369975L2.38721 0.000176384L0 0L0.0979642 0.136564ZM1.96115 1.08796C1.97908 1.1147 2.4251 1.73921 2.95232 2.47577C3.95222 3.8727 7.88144 9.36539 10.4084 12.8987C11.2159 14.0278 11.8864 14.9615 11.8984 14.9737C11.9157 14.9911 12.1508 14.9949 12.9971 14.9913L14.0738 14.9868L11.2562 11.0485C9.70657 8.88238 7.46293 5.74626 6.27037 4.0793L4.10205 1.04846L3.01532 1.04391L1.92858 1.03937L1.96115 1.08796Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="overflow-hidden text-ellipsis">ddwchen</span>
          </a>
        </li>
        <li>
          <a
            target="_blank"
            className="flex items-center gap-2 text-palette-foregroundMuted hover:text-blue-500"
            href="https://warpcast.com/treegirl"
          >
            <span>
              <svg
                width="1rem"
                height="1rem"
                viewBox="0 0 24 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.11859 0.043457H19.5979V21.9565H17.3257V11.9189H17.3034C17.0523 9.14476 14.7103 6.97081 11.8582 6.97081C9.00619 6.97081 6.66419 9.14476 6.41307 11.9189H6.39078V21.9565H4.11859V0.043457Z"
                  fill="currentColor"
                />
                <path
                  d="M0.000244141 3.1537L0.923321 6.26393H1.70439V18.8463C1.31223 18.8463 0.994327 19.1627 0.994327 19.5531V20.4014H0.852315C0.46016 20.4014 0.142256 20.7179 0.142256 21.1083V21.9565H8.09492V21.1083C8.09492 20.7179 7.77702 20.4014 7.38486 20.4014H7.24285V19.5531C7.24285 19.1627 6.92494 18.8463 6.53279 18.8463H5.68072V3.1537H0.000244141Z"
                  fill="currentColor"
                />
                <path
                  d="M17.4677 18.8463C17.0755 18.8463 16.7576 19.1627 16.7576 19.5531V20.4014H16.6156C16.2235 20.4014 15.9056 20.7179 15.9056 21.1083V21.9565H23.8582V21.1083C23.8582 20.7179 23.5403 20.4014 23.1482 20.4014H23.0062V19.5531C23.0062 19.1627 22.6883 18.8463 22.2961 18.8463V6.26393H23.0772L24.0002 3.1537H18.3198V18.8463H17.4677Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="overflow-hidden text-ellipsis">treegirl</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
