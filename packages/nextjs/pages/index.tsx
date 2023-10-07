import Image from "next/image";
import { BanknotesIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

function Home() {
  const images = [
    { src: "/sponsors/Azuro.png", alt: "azuro image" },
    { src: "/sponsors/buidlguidl.jpeg", alt: "buidlguidl image" },
    { src: "/sponsors/interface.png", alt: "interface image" },
    { src: "/sponsors/railgun.png", alt: "railgun image" },
    { src: "/sponsors/Request.png", alt: "request image" },
    { src: "/sponsors/Talentlayer.png", alt: "talentlayer image" },
  ];

  return (
    <div className="bg-white text-black">
      <main>
        <section id="home" className="pt-20">
          <div className="container lg:max-w-[1305px] lg:px-10">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-7/12">
                <div className="wow fadeInUp mb-12 lg:mb-0 lg:max-w-[570px] pl-[100px]" data-wow-delay=".2s">
                  <span className="mb-5 block text-lg font-medium leading-tight text-black  sm:text-[22px] xl:text-[22px]">
                    Invoicing made private.
                  </span>
                  <h1 className="mb-6 text-3xl font-bold leading-tight text-black  sm:text-[40px] md:text-[50px] lg:text-[42px] xl:text-[50px]">
                    Using
                    <span className="inline bg-secondary bg-clip-text text-transparent mx-2">
                      Railgun and Request Network
                    </span>
                    protocols.
                  </h1>
                  <p className="mb-10 max-w-[475px] text-base leading-relaxed text-body">
                    Pay and send invoices in a completely private way.
                  </p>
                </div>
              </div>

              <div className="w-full px-4 lg:w-5/12">
                <div className="wow fadeInUp relative z-10 mx-auto w-full max-w-[530px] lg:mr-0" data-wow-delay=".3s">
                  <Image
                    src="/images/home/hero/hero-light.png"
                    width="390"
                    height="750"
                    alt="hero image"
                    className="mx-auto max-w-full rounded-full "
                  />
                  <div className="max-auto absolute top-0 left-0 right-0 -z-10">
                    <div className="absolute top-5 right-0">
                      <svg width="72" height="51" viewBox="0 0 72 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_5_3665)">
                          <path
                            d="M22.378 0.4157C22.3814 0.342879 22.3851 0.270712 22.3891 0.199219C22.3857 0.271606 22.382 0.343766 22.378 0.4157C22.0401 7.83785 25.7079 22.0514 43.163 21.2025C36.0333 21.7022 21.9045 26.7677 22.3875 43.0291C22.1659 35.9367 17.5749 21.9221 1.00683 21.8442C0.856728 21.8465 0.709534 21.8469 0.56543 21.8454C0.713499 21.8439 0.86063 21.8435 1.00683 21.8442C8.04005 21.7355 21.4537 17.3609 22.378 0.4157Z"
                            fill="#ff0050"
                          />
                          <path
                            d="M59.3487 24.4888C59.3506 24.4451 59.3528 24.4018 59.3552 24.3589C59.3532 24.4023 59.351 24.4456 59.3487 24.4888C59.1459 28.942 61.3466 37.4702 71.8196 36.9608C67.5418 37.2606 59.0645 40.3 59.3543 50.0568C59.2213 45.8014 56.4667 37.3926 46.5259 37.3459C46.4359 37.3473 46.3475 37.3475 46.261 37.3466C46.3499 37.3457 46.4382 37.3454 46.5259 37.3459C50.7458 37.2807 58.794 34.6559 59.3487 24.4888Z"
                            fill="#1e293b"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5_3665">
                            <rect
                              width="71.2541"
                              height="49.8779"
                              fill="white"
                              transform="translate(0.56543 0.199219)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative z-10 pt-[100px] flex justify-center items-center">
          <div className="container max-w-[1390px]">
            <div className="rounded-2xl bg-white px-5 pt-14 pb-14 shadow-md md:pb-1 lg:pt-20 lg:pb-5 xl:px-10">
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className="wow fadeInUp group mx-auto mb-[60px] max-w-[310px] text-center" data-wow-delay=".3s">
                    <div className="mx-auto mb-8 flex h-[90px] w-[90px] items-center justify-center rounded-3xl bg-secondary bg-opacity-20 text-redpraha duration-300 group-hover:bg-secondary group-hover:text-white   ">
                      <ChatBubbleBottomCenterTextIcon width={48} height={48} />
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-black  sm:text-[22px] xl:text-[26px]">Invoice</h3>
                    <p className="text-base text-body">Send an encrypted invoice thanks to Request Network.</p>
                  </div>
                </div>

                <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className="wow fadeInUp group mx-auto mb-[60px] max-w-[310px] text-center" data-wow-delay=".2s">
                    <div className="mx-auto mb-8 flex h-[90px] w-[90px] items-center justify-center rounded-3xl bg-secondary bg-opacity-20 text-redpraha duration-300 group-hover:bg-secondary group-hover:text-white   ">
                      <BanknotesIcon width={48} height={48} />
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-black  sm:text-[22px] xl:text-[26px]">Pay</h3>
                    <p className="text-base text-body">Safely pay your invoice through your Railgun wallet.</p>
                  </div>
                </div>

                <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className="wow fadeInUp group mx-auto mb-[60px] max-w-[310px] text-center" data-wow-delay=".2s">
                    <div className="mx-auto mb-8 flex h-[90px] w-[90px] items-center justify-center rounded-3xl bg-secondary bg-opacity-20 text-redpraha duration-300 group-hover:bg-secondary group-hover:text-white   ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 487.451 487.451">
                        <g>
                          <path
                            fill="#ff0050"
                            d="M371.694,63.921h-87.83V88.06c0,4.046-3.281,7.326-7.326,7.326h-59.521c-3.164,0-5.851-2.01-6.876-4.819
		c0.353,0.054,0.71,0.089,1.077,0.089h59.521c4.045,0,7.325-3.28,7.325-7.326V7.326c0-4.045-3.28-7.326-7.325-7.326h-59.521
		c-4.047,0-7.326,3.281-7.326,7.326v56.596h-88.136c-4.046,0-7.326,3.281-7.326,7.326v408.879c0,4.045,3.28,7.324,7.326,7.324
		h255.938c4.046,0,7.326-3.279,7.326-7.324V71.247C379.021,67.203,375.74,63.921,371.694,63.921z M226.48,26.247h28.994
		c5.271,0,9.541,4.271,9.541,9.54s-4.271,9.54-9.541,9.54H226.48c-5.268,0-9.54-4.271-9.54-9.54S221.212,26.247,226.48,26.247z
		 M205.566,169.084l0.293-0.337c1.13-0.82,1.68-2.11,1.464-3.43c-2.823-17.042-0.974-24.141-0.336-25.921
		c4.931-15.135,20.479-22.223,23.53-23.474c0.638-0.248,1.827-0.615,3.082-0.811l0.32-0.075l2.575-0.143l0.014,0.158l0.55-0.045
		l2.183-0.386c0.479,0.003,6.479,0.752,15.52,3.53l6.237,2.14c11.382,3.365,16.676,9.663,17.656,10.922
		c9.139,10.367,6.701,26.012,4.424,34.415c-0.248,0.966-0.098,1.975,0.449,2.796l0.516,0.659c0.834,1.11,1.146,4.843-0.719,11.769
		c-0.383,2.26-1.213,4.094-2.457,5.315c-0.429,0.473-0.75,1.117-0.871,1.807c-3.096,18.125-19.323,38.402-36.438,38.402
		c-14.546,0-31.129-18.662-34.11-38.384c-0.11-0.72-0.417-1.361-0.918-1.912c-1.238-1.285-2.035-3.145-2.518-5.899
		C204.573,174.992,204.429,170.824,205.566,169.084z M172.086,248.342c0.121-0.156,3.497-4.445,11.511-7.504
		c0,0,17.322-6.747,17.646-6.855c9.015-3.272,18.066-10.093,18.066-10.093l0.621,0.539c7.484,6.446,15.589,9.857,23.432,9.857
		c0.045,0,0.091-0.004,0.136-0.006c0,0,0.546,0.006,0.591,0.006c7.843,0,15.947-3.411,23.432-9.857l0.622-0.539
		c0,0,9.051,6.82,18.064,10.093c0.324,0.108,17.646,6.855,17.646,6.855c8.014,3.059,11.391,7.348,11.511,7.504
		c12.41,18.43,14.507,58.693,14.718,63.191c-0.097,6.309-1.885,7.915-2.361,8.238c-26.687,11.939-62.956,16.791-84.223,16.791
		s-57.082-4.852-83.768-16.791c-0.477-0.323-2.265-1.932-2.36-8.238C157.58,307.036,159.677,266.771,172.086,248.342z
		 M285.438,433.861H150.569v-21.553h134.868V433.861L285.438,433.861z M336.882,391.455H150.569v-21.553h186.312V391.455z"
                          />
                        </g>
                      </svg>
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-black  sm:text-[22px] xl:text-[26px]">Manage</h3>
                    <p className="text-base text-body">Easily keep tracks of your payments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 -z-10">
            {/*THE STRANGE BACKGROUND GRADIENT START*/
            /*This guy can ruin the footer so hard*/}
            <svg width="602" height="500" viewBox="0 0 602 1154" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.25" filter="url(#filter0_f_26_84)">
                <circle cx="577" cy="577" r="317" fill="url(#paint0_linear_26_84)" />
              </g>
              <defs>
                <filter
                  id="filter0_f_26_84"
                  x="0"
                  y="0"
                  width="1154"
                  height="1154"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="130" result="effect1_foregroundBlur_26_84" />
                </filter>
                <linearGradient
                  id="paint0_linear_26_84"
                  x1="183.787"
                  y1="894"
                  x2="970.173"
                  y2="346.491"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8EA5FE" />
                  <stop offset="0.541667" stopColor="#BEB3FD" />
                  <stop offset="1" stopColor="#90D1FF" />
                </linearGradient>
              </defs>
            </svg>
            {/*THE STRANGE BACKGROUND GRADIENT END*/}
          </div>
          <div className="absolute left-0 -bottom-1/2 -z-10 hidden md:block">
            <svg width="622" height="1236" viewBox="0 0 622 1236" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.2" filter="url(#filter0_f_26_85)">
                <circle cx="4" cy="618" r="368" fill="url(#paint0_linear_26_85)" />
              </g>
              <defs>
                <filter
                  id="filter0_f_26_85"
                  x="-614"
                  y="0"
                  width="1236"
                  height="1236"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="125" result="effect1_foregroundBlur_26_85" />
                </filter>
                <linearGradient
                  id="paint0_linear_26_85"
                  x1="-364s"
                  y1="250"
                  x2="506.12"
                  y2="754.835"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF8FE8" />
                  <stop offset="1" stopColor="#FFC960" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>

        <section id="demo video" className="grid pt-[80px] pb-[50px] justify-center items-center">
          <div className="container">
            <div className="wow fadeInUp mx-auto mb-14 max-w-[690px] text-center lg:mb-[34px]" data-wow-delay=".2s">
              <h2 className="mb-4 font-bold text-black md:text-[40px] md:leading-tight">See how it works!</h2>
            </div>
          </div>

          <iframe
            width="650"
            height="355"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=rzH-R0efqfA8gnj1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </section>

        <section id="sponsors" className="grid pt-[60px] pb-[25px] justify-center">
          <div className="container">
            <div className="wow fadeInUp mx-auto mb-14 max-w-[690px] text-center lg:mb-[34px]" data-wow-delay=".2s">
              <h2 className="mb-4 font-bold text-black md:text-[40px] md:leading-tight">Built with</h2>
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-12 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image width={60} height={6} src={image.src} alt={image.alt} className="w-full" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
