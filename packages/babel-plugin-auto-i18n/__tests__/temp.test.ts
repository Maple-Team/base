import { getTransformCode } from './test-help'

describe('temp case', () => {
  it('case1', () => {
    const sourceCode = `
    import { memo } from 'react'

    export const IconPower = memo(({ opacity = 1, className }: { className?: string; opacity?: number }) => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="68px"
          height="68px"
          viewBox="0 0 68 68"
          version="1.1"
          className={className ?? ''}
        >
          <defs>
            <polygon
              id="path-1"
              points="0 0 52.832769 0 52.832769 52.5555556 0 52.5555556"
            />
          </defs>
          <g
            id="驾驶舱"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
            opacity={opacity}
          >
            <g
              id="小屏切图-黑"
              transform="translate(-538.000000, -396.000000)"
            >
              <g
                id="编组"
                transform="translate(538.000000, 396.000000)"
              >
                <g transform="translate(8.000000, 8.000000)">
                  <mask
                    id="mask-2"
                    fill="white"
                  >
                    <use xlinkHref="#path-1" />
                  </mask>
                  <g id="Clip-2" />
                  <path
                    d="M51.0317422,26.2777503 C51.0317422,39.8009904 40.0111068,50.7638121 26.4165502,50.7638121 C12.8217174,50.7638121 1.80108198,39.8009904 1.80108198,26.2777503 L1.80108198,26.2777503 C1.80108198,12.7545102 12.8217174,1.79168852 26.4165502,1.79168852 C40.0111068,1.79168852 51.0317422,12.7545102 51.0317422,26.2777503 M26.4165502,-5.49446017e-05 C11.8269466,-5.49446017e-05 -0.000110468718,11.7649579 -0.000110468718,26.2777503 C-0.000110468718,40.7905427 11.8269466,52.5555556 26.4165502,52.5555556 C41.0058776,52.5555556 52.8329347,40.7905427 52.8329347,26.2777503 C52.8329347,11.7649579 41.0058776,-5.49446017e-05 26.4165502,-5.49446017e-05"
                    id="Fill-1"
                    fill="#FFFFFF"
                    mask="url(#mask-2)"
                  />
                </g>
                <path
                  d="M38.6670827,47.3689061 C31.7799105,49.7004802 24.287922,46.0914441 21.8565055,39.2706212 C19.5598609,32.5432042 23.1801969,25.2374952 29.9428157,22.9526239 C29.9889364,22.9369647 30.0353332,22.9215802 30.0817301,22.9067452 L30.2377672,22.9067452 C30.4357823,22.8877893 30.6117038,23.0320189 30.6307596,23.22927 C30.634626,23.2691048 30.6315881,23.3094891 30.6221983,23.3484998 L30.6221983,25.0446396 C30.6221983,25.2836487 30.5501175,25.4388672 30.3938042,25.4388672 C24.9921601,27.4550593 22.2561261,33.4453945 24.2829509,38.8187019 C24.3174724,38.9101846 24.3530986,39.0011179 24.3901056,39.0915018 C26.6674182,44.4980506 32.9003394,47.0678097 38.3550085,44.8485972 C43.7870316,42.7634495 46.4913058,36.6926205 44.3951619,31.2890936 C44.3832865,31.2580499 44.3708587,31.2270062 44.3587072,31.1959625 C43.2211556,28.524556 41.0606636,26.4141338 38.3550085,25.3314505 C38.1986953,25.3314505 38.1266145,25.1759572 38.1266145,24.9372229 L38.1266145,23.2171822 C38.1835059,22.9864149 38.4176995,22.845482 38.6494077,22.9020749 C38.6554835,22.9034485 38.6612831,22.9048221 38.6670827,22.9067452 C42.5276882,24.183383 45.5691682,27.1778638 46.8923072,31.00503 C49.2102171,37.6901397 45.641249,44.9788159 38.9208845,47.2848408 C38.8366522,47.3136867 38.7518674,47.3417085 38.6670827,47.3689061 L38.6670827,47.3689061 Z M33.1555222,21.2820333 C33.1676737,20.8468721 33.5319443,20.503743 33.9696766,20.5158308 C33.9823805,20.5161056 33.9953606,20.516655 34.0080645,20.5177539 L34.7888022,20.5177539 C35.2251536,20.4845124 35.6059945,20.8095097 35.6391351,21.2438468 C35.6402398,21.2564841 35.6407921,21.2693961 35.6410683,21.2820333 L35.6410683,33.0951227 C35.6410683,33.5635254 35.2593989,33.9431926 34.7888022,33.9431926 L34.0080645,33.9431926 C33.5399533,33.936874 33.1621503,33.5610529 33.1555222,33.0951227 L33.1555222,21.2820333 Z M34.584435,11.5832122 C21.9846492,11.5832122 11.770434,21.7438427 11.770434,34.2778053 C11.7660167,46.8114931 21.9769164,56.975695 34.5769784,56.9798172 C47.1767642,56.9842114 57.3945682,46.8268776 57.3987108,34.292915 L57.3987108,34.2778053 C57.3987108,21.7438427 47.184497,11.5832122 34.584435,11.5832122 Z"
                  id="Fill-3"
                  fill="#FFFFFF"
                />
              </g>
            </g>
          </g>
        </svg>
      )
    })
`
    const result = getTransformCode(sourceCode, 'C:\\code\\filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
})
