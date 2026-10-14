/* Střední Evropa včetně Švýcarska. Obrysy: Natural Earth 1:50m, public domain. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RacletteEurope = api;
})(typeof self !== "undefined" ? self : this, function () {
  const VIEW = {"width":1040,"height":720,"minLng":5.5,"maxLng":23.1,"minLat":45.2,"maxLat":53.2};
  const COUNTRIES = [{"id":"fr","d":"M125.0 504.7L117.9 508.7L113.5 517.0L108.9 519.0L100.6 519.1L96.7 513.9L91.8 514.0L86.8 517.2L82.8 522.5L88.7 529.0L69.0 555.6L56.5 562.6L53.8 580.0L39.0 593.0L33.6 606.7L33.1 609.5L36.8 613.9L35.2 622.9L27.8 628.7L27.9 634.4L29.9 635.2L34.7 634.8L41.3 630.6L45.7 625.3L43.4 618.1L48.6 612.6L54.9 609.3L63.7 608.6L75.4 611.4L75.9 619.7L77.8 623.2L75.2 633.1L85.9 646.5L89.9 654.7L77.1 664.7L76.3 671.3L81.6 677.7L89.4 693.0L97.7 701.9L93.3 716.4L85.9 720.0L0.0 720.0L0.0 331.6L17.1 329.6L19.1 332.5L30.2 337.9L40.2 333.1L43.9 333.5L49.9 337.3L56.6 338.1L61.1 342.5L63.5 349.2L73.0 363.5L75.4 364.1L82.2 359.3L88.7 361.8L90.8 367.9L95.6 366.5L100.4 367.8L115.3 364.3L119.7 370.2L124.7 372.4L147.8 377.0L155.7 380.4L156.0 388.2L138.2 410.8L130.3 442.8L125.1 453.9L123.2 462.2L124.6 467.8L123.7 476.5L120.5 488.4L119.9 497.4L122.0 503.4Z","label":null,"interactive":false},{"id":"de","d":"M237.8 510.8L217.6 497.6L199.8 498.9L196.8 494.7L194.6 493.5L190.8 495.0L181.6 488.2L173.5 492.2L171.6 496.1L172.1 498.4L180.4 498.7L181.4 500.6L173.1 504.7L159.4 503.4L153.3 506.1L143.4 507.3L129.9 506.7L122.0 503.4L119.9 497.4L120.5 488.4L123.7 476.5L124.6 467.8L123.2 462.2L125.1 453.9L130.3 442.8L138.2 410.8L156.0 388.2L155.7 380.4L147.8 377.0L124.7 372.4L119.7 370.2L115.3 364.3L100.4 367.8L95.6 366.5L90.8 367.9L88.7 361.8L82.2 359.3L75.4 364.1L73.0 363.5L63.5 349.2L61.1 342.5L56.6 338.1L49.9 337.3L51.9 324.0L58.2 314.3L58.3 306.1L44.7 299.5L37.7 290.3L35.9 279.5L39.9 267.1L51.1 259.5L49.7 247.3L40.1 241.0L39.5 238.9L43.5 234.3L29.2 220.5L32.4 206.6L29.9 202.5L23.3 199.4L21.1 195.3L21.8 193.9L26.0 194.3L37.2 184.7L37.6 183.2L34.4 181.8L34.0 177.8L41.3 157.5L41.0 154.0L34.9 144.1L34.8 140.6L26.5 129.4L26.5 125.8L39.4 118.7L50.6 123.8L54.7 120.7L60.1 121.1L73.4 116.0L75.4 113.6L77.0 109.8L71.8 104.7L72.4 100.8L87.3 89.5L89.8 84.1L90.7 73.8L86.8 68.0L78.7 68.2L73.8 66.2L70.4 60.3L71.5 52.4L73.8 50.9L89.4 51.0L90.6 49.4L91.6 41.0L99.9 18.0L99.9 0.0L526.6 0.0L524.1 8.5L519.6 15.6L510.5 24.0L509.9 29.0L517.3 37.6L532.6 49.9L538.9 60.4L535.0 75.6L538.7 83.0L542.4 85.5L543.9 98.1L546.7 100.6L542.2 116.6L537.8 123.1L539.1 128.6L545.1 138.4L545.1 150.9L555.8 156.3L562.3 175.3L559.2 189.4L549.4 212.2L545.0 214.7L541.2 213.1L538.5 211.0L539.1 205.7L537.4 205.3L534.5 198.5L521.2 194.6L517.4 197.8L524.6 205.7L524.1 207.1L496.3 219.5L476.1 224.6L469.0 233.9L465.3 232.0L457.2 236.1L453.9 242.1L444.2 243.9L439.8 251.4L429.3 249.2L416.5 252.6L410.8 256.5L400.5 271.7L394.4 262.0L392.1 260.0L389.4 260.8L396.4 279.2L411.1 292.0L414.3 297.4L407.2 311.4L424.3 340.7L432.2 348.4L438.3 348.3L451.5 363.7L460.2 369.2L466.9 380.0L469.2 382.0L475.5 381.6L491.3 399.0L489.6 415.1L486.0 419.2L483.1 420.9L471.9 415.6L465.3 435.5L437.1 449.7L429.0 458.4L429.0 461.2L440.4 477.8L440.5 485.3L437.1 493.0L445.2 495.1L446.4 499.0L444.0 515.0L441.3 515.2L431.9 509.2L429.7 500.5L424.6 497.8L412.6 500.6L405.6 496.1L396.5 493.4L395.1 502.2L367.4 505.5L348.2 514.2L342.6 519.8L336.3 519.7L327.5 522.6L323.9 522.2L318.7 515.7L317.5 511.2L291.9 508.4L287.7 525.1L284.4 529.8L276.7 532.9L277.7 525.3L269.8 522.6L269.4 517.6L264.2 512.5L251.1 506.2L245.3 510.7L239.3 509.9Z","label":[246.9,201.4],"interactive":false},{"id":"pl","d":"M1040.0 0.0L1040.0 292.7L1013.4 329.5L1018.3 351.4L1016.7 362.6L1025.1 370.7L1022.8 376.1L1009.3 371.1L1003.0 370.7L976.2 359.1L973.1 351.1L968.5 347.1L953.7 340.9L936.6 339.4L920.6 340.4L912.8 349.5L904.1 348.4L899.9 344.7L893.2 342.7L878.3 343.3L866.5 349.5L860.2 361.7L851.9 358.1L845.1 360.7L842.4 359.6L844.3 353.7L843.5 344.5L835.0 341.4L823.8 324.2L812.5 332.0L806.6 342.0L795.9 342.3L794.1 333.2L787.8 332.0L786.3 322.8L773.8 309.8L771.9 298.9L759.2 294.3L756.7 295.7L740.3 284.8L737.7 288.1L731.2 290.5L728.7 289.5L714.8 275.4L714.4 273.8L721.5 270.6L723.0 267.2L721.0 260.4L712.3 264.2L704.1 265.1L688.5 254.0L672.5 249.6L678.9 266.7L670.2 271.2L660.6 279.2L658.2 278.8L640.2 255.0L634.1 252.5L632.9 249.9L637.1 244.5L641.5 243.0L645.3 236.4L637.1 229.0L620.9 233.0L617.4 227.7L604.5 221.4L582.3 214.9L577.7 208.5L576.6 201.7L561.0 196.7L560.4 208.2L550.1 210.7L559.2 189.4L562.3 175.3L555.8 156.3L545.1 150.9L545.1 138.4L539.1 128.6L537.8 123.1L542.2 116.6L546.7 100.6L543.9 98.1L542.4 85.5L538.7 83.0L535.0 75.6L538.9 60.4L532.6 49.9L517.3 37.6L509.9 29.0L510.5 24.0L519.6 15.6L524.1 8.5L526.6 0.0Z","label":[826.7,108.9],"interactive":false},{"id":"it","d":"M89.9 654.7L96.3 658.8L108.0 655.9L120.5 650.0L135.2 655.0L147.3 646.6L155.1 633.5L153.4 623.6L169.6 607.9L172.7 607.9L174.8 625.9L185.6 638.0L196.1 641.1L193.7 648.3L200.0 655.3L201.2 660.4L204.1 663.3L208.2 661.9L209.6 659.2L207.0 646.7L221.7 622.2L222.2 605.2L224.8 603.4L232.1 604.6L235.2 616.6L238.1 620.4L244.6 621.4L259.1 614.9L262.3 615.4L268.3 626.6L270.7 627.5L274.5 625.2L268.2 604.5L271.1 594.0L277.5 592.1L282.0 597.2L291.4 598.5L291.8 592.3L289.4 588.1L292.7 570.2L306.6 571.8L310.8 576.6L314.9 578.2L324.6 578.1L332.9 563.7L339.4 560.2L356.2 558.2L370.8 559.3L394.1 550.6L396.0 552.5L391.8 559.4L393.2 563.8L407.0 584.8L412.4 587.5L453.2 596.5L472.1 598.0L484.5 601.2L483.3 606.3L466.8 619.4L465.5 624.5L468.1 628.9L472.2 628.5L480.6 632.1L479.6 636.0L471.9 644.4L472.0 649.2L478.7 649.8L476.8 662.9L492.3 676.8L494.9 682.7L493.1 684.6L485.7 685.1L489.5 681.5L480.3 668.6L476.2 668.6L470.7 674.1L455.4 668.6L445.0 680.6L437.5 683.0L413.5 696.4L409.6 695.9L415.8 689.0L413.2 688.8L400.3 697.9L397.4 716.3L401.3 720.0L85.9 720.0L93.3 716.4L97.7 701.9L89.4 693.0L81.6 677.7L76.3 671.3L77.1 664.7L85.1 659.8Z","label":[298.3,654.6],"interactive":false},{"id":"ua","d":"M1040.0 462.9L1037.3 467.4L1026.8 472.7L1025.7 465.3L1020.4 458.1L1015.0 458.6L1009.4 455.9L1005.7 449.5L995.7 445.0L990.0 431.3L982.8 431.5L983.4 416.8L992.4 406.3L998.0 389.4L1006.8 371.5L1022.8 376.1L1024.6 374.5L1025.1 370.7L1016.7 362.6L1018.3 351.4L1013.4 329.5L1040.0 292.7Z","label":null,"interactive":false},{"id":"hr","d":"M477.3 691.5L479.5 695.1L495.1 699.4L498.5 697.5L501.8 692.2L507.3 695.0L524.1 694.7L527.5 692.5L533.8 679.9L535.9 678.8L540.7 686.6L549.1 695.0L552.3 695.9L558.7 693.0L567.9 697.4L575.7 698.3L581.4 696.0L578.1 685.8L582.3 678.6L577.7 672.1L598.3 662.9L599.9 660.4L601.3 649.5L600.7 643.6L596.6 638.2L597.3 632.5L598.9 629.9L620.5 620.5L624.4 614.6L633.9 614.4L635.4 613.0L634.4 604.5L639.4 599.9L651.0 603.0L664.7 610.5L672.0 617.5L681.5 631.1L693.9 641.1L697.9 648.3L703.6 652.4L715.4 655.8L717.3 659.8L727.2 666.9L759.8 670.2L770.2 666.3L778.0 656.3L781.3 657.1L792.1 654.1L791.4 660.1L788.2 662.8L794.6 679.0L792.9 683.9L795.0 687.8L801.5 691.7L798.2 696.1L798.0 702.0L803.2 707.7L817.2 713.9L821.4 720.0L683.7 720.0L674.7 713.1L667.5 720.0L651.8 718.5L650.4 720.0L620.2 720.0L613.9 718.6L609.7 720.0L541.7 720.0L534.8 711.2L525.1 707.2L520.8 707.6L516.9 720.0L479.1 720.0L473.7 694.6ZM535.1 720.0L536.0 717.8L537.9 720.0Z","label":null,"interactive":false},{"id":"at","d":"M238.0 533.6L242.8 522.7L243.8 516.0L237.8 510.8L245.3 510.7L251.1 506.2L264.2 512.5L269.4 517.6L269.8 522.6L277.7 525.3L276.7 532.9L284.4 529.8L287.7 525.1L291.9 508.4L317.5 511.2L318.7 515.7L323.9 522.2L327.5 522.6L336.3 519.7L342.6 519.8L348.2 514.2L367.4 505.5L395.1 502.2L396.5 493.4L405.6 496.1L412.6 500.6L424.6 497.8L429.7 500.5L431.9 509.2L441.3 515.2L444.0 515.0L446.4 499.0L445.2 495.1L437.1 493.0L440.5 485.3L440.4 477.8L429.0 461.2L432.2 453.5L448.0 443.2L462.3 438.2L465.3 435.5L471.9 415.6L483.1 420.9L486.0 419.2L489.6 415.1L491.3 399.0L501.6 405.7L505.2 413.8L524.0 416.1L531.1 411.7L543.1 414.1L544.0 407.5L548.7 400.7L550.8 398.3L556.8 398.6L561.0 377.9L565.3 378.2L570.9 382.8L579.7 380.3L602.8 390.6L610.1 390.2L623.8 400.1L642.2 401.5L648.7 396.0L652.6 396.3L662.6 401.9L672.7 404.7L676.8 414.1L671.4 428.3L671.6 433.2L684.6 464.4L688.3 467.5L684.8 471.3L681.3 482.7L683.5 494.3L666.9 496.9L655.4 490.5L645.3 497.3L646.0 498.9L658.3 503.2L660.4 509.8L657.3 517.7L650.9 521.6L646.6 522.0L647.8 533.4L645.1 537.9L646.4 544.9L649.6 547.0L647.2 557.4L640.1 557.8L635.4 560.5L622.7 572.0L619.1 575.9L618.0 587.0L606.7 584.0L598.7 585.1L587.3 591.3L574.2 590.1L555.1 593.5L547.0 603.1L534.8 612.0L492.3 602.0L453.2 596.5L412.4 587.5L407.0 584.8L393.2 563.8L391.8 559.4L396.0 552.5L394.1 550.6L370.8 559.3L356.2 558.2L339.4 560.2L332.9 563.7L326.5 576.3L320.7 578.7L310.8 576.6L306.6 571.8L292.7 570.2L290.4 561.2L286.6 559.4L276.5 570.4L273.8 571.4L258.7 563.6L256.8 557.3L241.1 552.8L242.9 548.4L238.5 535.1Z","label":[510,511.3],"interactive":false},{"id":"hu","d":"M982.8 431.5L990.0 431.3L995.7 445.0L1005.7 449.5L1009.4 455.9L1015.0 458.6L1020.4 458.1L1025.7 465.3L1026.8 472.7L1011.0 489.0L1004.0 488.5L992.2 492.5L975.0 512.5L974.7 522.4L967.3 530.6L962.3 545.6L955.0 554.0L954.5 561.3L945.1 576.9L945.3 584.6L934.8 593.3L930.8 604.2L931.5 610.9L927.2 612.8L923.1 622.6L918.3 626.2L906.3 624.6L901.7 625.8L898.6 632.4L893.1 636.0L886.8 633.0L873.4 636.0L871.1 638.2L866.4 635.2L852.9 633.5L847.6 634.9L834.0 632.8L829.1 634.0L822.6 642.2L814.2 647.7L806.4 649.2L802.9 646.5L798.7 651.6L793.5 654.2L781.3 657.1L778.0 656.3L770.2 666.3L759.8 670.2L727.2 666.9L717.3 659.8L715.4 655.8L703.6 652.4L697.9 648.3L693.9 641.1L676.0 625.2L672.0 617.5L664.7 610.5L651.0 603.0L643.0 590.5L643.2 586.7L640.3 583.1L637.2 570.8L626.0 570.3L635.4 560.5L640.1 557.8L647.2 557.4L649.6 547.0L646.4 544.9L645.1 537.9L647.8 533.4L646.6 522.0L650.9 521.6L657.3 517.7L660.4 509.8L658.3 503.2L646.0 498.9L645.3 497.3L655.4 490.5L666.9 496.9L683.5 494.3L681.9 479.4L684.1 476.9L684.8 471.3L689.9 466.9L698.3 468.8L717.1 485.1L724.6 488.7L747.2 489.3L781.4 487.2L784.6 481.2L783.0 473.4L785.4 468.0L792.7 463.4L813.4 461.4L825.3 458.0L831.1 448.8L834.7 447.9L850.8 456.2L876.5 441.4L885.8 420.6L894.8 418.5L908.0 418.9L919.9 422.5L942.6 418.3L949.2 423.4L955.8 433.9L961.2 437.6L981.6 432.6Z","label":[824.2,550.2],"interactive":false},{"id":"sk","d":"M1006.8 371.5L998.0 389.4L992.4 406.3L983.4 416.8L981.6 432.6L961.2 437.6L955.8 433.9L949.2 423.4L942.6 418.3L919.9 422.5L908.0 418.9L894.8 418.5L885.8 420.6L876.5 441.4L850.8 456.2L834.7 447.9L831.1 448.8L825.3 458.0L813.4 461.4L792.7 463.4L785.4 468.0L783.0 473.4L784.6 481.2L781.4 487.2L747.2 489.3L724.6 488.7L717.1 485.1L698.3 468.8L688.3 467.5L684.6 464.4L671.6 433.2L671.4 428.3L676.2 418.4L678.7 407.1L687.6 392.3L690.7 390.5L708.1 393.5L716.5 392.2L724.4 388.1L733.5 378.1L741.6 374.7L743.7 372.1L745.1 361.8L748.1 354.8L760.2 347.7L763.2 342.8L773.9 333.8L787.8 332.0L794.1 333.2L795.9 342.3L806.6 342.0L812.5 332.0L823.8 324.2L835.0 341.4L843.5 344.5L844.3 353.7L842.4 359.6L845.1 360.7L851.9 358.1L860.2 361.7L866.5 349.5L878.3 343.3L893.2 342.7L908.1 349.7L916.0 347.4L920.6 340.4L936.6 339.4L953.7 340.9L968.5 347.1L973.1 351.1L976.2 359.1L1003.0 370.7Z","label":[800.7,401.9],"interactive":false},{"id":"si","d":"M651.0 603.0L639.4 599.9L634.4 604.5L635.4 613.0L633.9 614.4L624.4 614.6L620.5 620.5L616.5 623.0L598.9 629.9L596.4 635.4L600.7 643.6L599.9 660.4L598.3 662.9L577.7 672.1L582.3 678.6L578.1 685.8L581.4 696.0L575.7 698.3L567.9 697.4L558.7 693.0L552.3 695.9L549.1 695.0L540.7 686.6L535.9 678.8L533.8 679.9L527.5 692.5L524.1 694.7L507.3 695.0L501.8 692.2L498.5 697.5L495.1 699.4L479.5 695.1L477.3 691.5L485.7 685.1L493.1 684.6L494.9 682.7L492.3 676.8L485.8 669.5L477.7 664.9L478.7 649.8L472.0 649.2L471.9 644.4L479.6 636.0L480.6 632.1L472.2 628.5L468.1 628.9L465.5 624.5L466.8 619.4L483.3 606.3L484.5 601.2L534.8 612.0L547.0 603.1L555.1 593.5L574.2 590.1L587.3 591.3L598.7 585.1L606.7 584.0L618.0 587.0L619.1 575.9L626.0 570.3L637.2 570.8L640.3 583.1L643.2 586.7L643.0 590.5L650.3 601.0Z","label":[556.4,642.5],"interactive":false},{"id":"be","d":"M0.0 173.0L6.4 180.1L14.9 182.7L19.3 186.7L14.8 202.5L8.7 210.0L11.4 218.3L29.2 220.5L36.6 226.9L43.5 234.3L39.5 238.9L40.1 241.0L49.7 247.3L51.1 259.5L39.9 267.1L36.4 277.1L34.8 274.1L28.1 273.0L21.7 280.5L14.4 295.2L13.3 305.3L22.5 320.0L18.6 328.2L0.0 331.6Z","label":null,"interactive":false},{"id":"nl","d":"M29.2 220.5L11.4 218.3L8.7 210.0L14.8 202.5L19.3 186.7L14.9 182.7L6.4 180.1L0.0 173.0L0.0 0.0L99.9 0.0L99.9 18.0L91.6 41.0L90.6 49.4L89.4 51.0L73.8 50.9L71.5 52.4L70.4 60.3L73.8 66.2L78.7 68.2L86.8 68.0L90.7 73.8L89.8 84.1L87.3 89.5L72.4 100.8L71.8 104.7L77.0 109.8L75.4 113.6L73.4 116.0L60.1 121.1L54.7 120.7L50.6 123.8L39.4 118.7L26.5 125.8L26.5 129.4L34.8 140.6L34.9 144.1L41.0 154.0L41.3 157.5L34.0 177.8L34.4 181.8L37.6 183.2L37.2 184.7L26.0 194.3L21.8 193.9L21.1 195.3L23.3 199.4L29.9 202.5L32.4 206.6Z","label":null,"interactive":false},{"id":"lu","d":"M36.4 277.1L37.7 290.3L44.7 299.5L58.3 306.1L58.2 314.3L51.9 324.0L49.9 337.3L40.2 333.1L30.2 337.9L19.1 332.5L17.1 329.6L22.5 320.0L13.3 305.3L14.4 295.2L21.7 280.5L28.1 273.0L34.8 274.1L36.0 276.9Z","label":null,"interactive":false},{"id":"cz","d":"M787.8 332.0L773.9 333.8L763.2 342.8L760.2 347.7L748.1 354.8L745.1 361.8L743.7 372.1L741.6 374.7L733.5 378.1L724.4 388.1L716.5 392.2L708.1 393.5L690.7 390.5L687.6 392.3L683.3 397.7L676.8 414.1L672.7 404.7L662.6 401.9L652.6 396.3L648.7 396.0L642.2 401.5L623.8 400.1L610.1 390.2L602.8 390.6L579.7 380.3L570.9 382.8L565.3 378.2L561.0 377.9L556.8 398.6L550.8 398.3L548.7 400.7L544.0 407.5L543.1 414.1L531.1 411.7L524.0 416.1L513.5 415.9L505.2 413.8L501.6 405.7L491.3 399.0L475.5 381.6L469.2 382.0L460.2 369.2L451.5 363.7L438.3 348.3L432.2 348.4L424.3 340.7L407.2 311.4L414.3 297.4L411.1 292.0L396.4 279.2L389.4 263.8L390.0 260.0L392.1 260.0L400.5 271.7L410.8 256.5L416.5 252.6L429.3 249.2L439.8 251.4L444.2 243.9L453.9 242.1L457.2 236.1L465.3 232.0L469.0 233.9L476.1 224.6L496.3 219.5L524.1 207.1L524.6 205.7L517.4 197.8L519.0 195.3L521.2 194.6L534.5 198.5L537.4 205.3L539.1 205.7L538.5 211.0L545.0 214.7L547.6 214.4L550.1 210.7L560.4 208.2L561.0 196.7L576.6 201.7L577.7 208.5L582.3 214.9L604.5 221.4L617.4 227.7L620.9 233.0L637.1 229.0L641.7 232.1L645.3 236.4L642.9 241.5L637.1 244.5L632.9 249.9L634.1 252.5L640.2 255.0L658.2 278.8L660.6 279.2L670.2 271.2L678.9 266.7L672.5 249.6L688.5 254.0L704.1 265.1L712.3 264.2L721.0 260.4L723.0 267.2L721.5 270.6L714.4 273.8L716.6 277.5L731.2 290.5L737.7 288.1L740.3 284.8L756.7 295.7L759.2 294.3L769.1 296.8L771.9 298.9L773.8 309.8L786.3 322.8L787.6 329.4Z","label":[583.7,298.6],"interactive":true},{"id":"ch","d":"M237.8 510.8L243.8 516.0L235.4 542.5L235.6 552.4L243.4 552.8L256.8 557.3L258.7 563.6L273.8 571.4L276.5 570.4L286.6 559.4L290.4 561.2L292.8 567.1L289.4 588.1L291.8 592.3L291.4 598.5L282.0 597.2L277.5 592.1L271.1 594.0L268.2 604.5L272.4 615.3L273.5 626.6L268.3 626.6L262.3 615.4L259.1 614.9L244.6 621.4L238.1 620.4L235.2 616.6L232.1 604.6L224.8 603.4L222.2 605.2L221.7 622.2L207.0 646.7L209.6 659.2L208.2 661.9L204.1 663.3L201.2 660.4L200.0 655.3L193.7 648.3L196.1 641.1L185.6 638.0L174.8 625.9L172.7 607.9L169.6 607.9L153.4 623.6L155.1 633.5L147.3 646.6L135.2 655.0L120.5 650.0L108.0 655.9L96.3 658.8L91.9 656.7L75.2 633.1L77.8 623.2L74.3 610.6L63.7 608.6L54.9 609.3L48.6 612.6L43.4 618.1L45.7 625.3L41.3 630.6L34.7 634.8L27.9 634.4L27.8 628.7L35.2 622.9L36.8 613.9L33.1 609.5L39.0 593.0L53.8 580.0L56.5 562.6L69.0 555.6L85.8 534.0L88.7 527.4L84.0 525.5L82.8 522.5L86.8 517.2L91.8 514.0L96.7 513.9L100.6 519.1L108.9 519.0L113.5 517.0L117.9 508.7L125.0 504.7L129.9 506.7L143.4 507.3L153.3 506.1L159.4 503.4L174.6 504.3L180.8 501.8L181.2 499.3L174.4 499.3L171.6 496.1L173.5 492.2L181.6 488.2L190.8 495.0L194.6 493.5L196.8 494.7L199.8 498.9L217.6 497.6L227.5 504.1Z","label":[116.1,583.3],"interactive":true},{"id":"li","d":"M241.1 552.8L235.6 552.4L235.4 542.5L238.0 533.6L242.9 548.4L242.0 551.2Z","label":null,"interactive":false}];

  const PIN_SIDE = { krizovy: "above", spindl: "above", kabrt: "left" };
  const CITIES = [
    { country: "cz", name: "Praha", lat: 50.0755, lng: 14.4378, side: "right", dx: 10 },
    { country: "cz", name: "Brno", lat: 49.1951, lng: 16.6068, side: "below" },
    { country: "ch", name: "Bern", lat: 46.948, lng: 7.4474, side: "above" },
    { country: "sk", name: "Bratislava", lat: 48.1486, lng: 17.1077, side: "below" },
    { country: "at", name: "Vídeň", lat: 48.2082, lng: 16.3738, side: "above" },
    { country: "hu", name: "Budapešť", lat: 47.4979, lng: 19.0402, side: "left" }
  ];
  const FLAGS = {
    cz: '<svg class="flag-svg" viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="20" fill="#ffffff"/><rect y="20" width="60" height="20" fill="#d7141a"/><path d="M0 0 L28 20 L0 40 Z" fill="#11457e"/></svg>',
    ch: '<svg class="flag-svg" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="#da291c"/><rect x="13" y="6" width="6" height="20" fill="#ffffff"/><rect x="6" y="13" width="20" height="6" fill="#ffffff"/></svg>'
  };

  function project(lat, lng) {
    return {
      x: (lng - VIEW.minLng) / (VIEW.maxLng - VIEW.minLng) * VIEW.width,
      y: (VIEW.maxLat - lat) / (VIEW.maxLat - VIEW.minLat) * VIEW.height
    };
  }

  const CHEESE_ASPECT = 1.515;
  const STAGE_RATIO = CHEESE_ASPECT / (VIEW.width / VIEW.height);
  const CENTER_X = 50;
  const CENTER_Y = 44;
  const MAX_RX = 18.5;
  const MAX_RY = 14.5;

  function countryBounds(countryId) {
    const entry = COUNTRIES.find((item) => item.id === countryId);
    if (!entry) return null;
    const nums = entry.d.match(/[\d.]+/g).map(Number);
    const points = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length; i += 2) {
      const x = nums[i], y = nums[i + 1];
      points.push([x, y]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return {
      minX, maxX, midX: (minX + maxX) / 2, width: maxX - minX,
      minY, maxY, midY: (minY + maxY) / 2, height: maxY - minY,
      points
    };
  }

  function cameraFor(countryId) {
    const b = countryBounds(countryId) || countryBounds("cz");
    let widthPct = 200;
    for (const [x, y] of b.points) {
      const dx = Math.abs(x - b.midX) / VIEW.width * 100;
      const dy = Math.abs(y - b.midY) / VIEW.height * STAGE_RATIO * 100;
      if (dx > 0) widthPct = Math.min(widthPct, (MAX_RX / dx) * 100);
      if (dy > 0) widthPct = Math.min(widthPct, (MAX_RY / dy) * 100);
      const ell = Math.hypot(dx / (MAX_RX * 1.08), dy / (MAX_RY * 1.08));
      if (ell > 0) widthPct = Math.min(widthPct, (1 / ell) * 100);
    }
    const heightPct = widthPct * STAGE_RATIO;
    const leftPct = CENTER_X - (b.midX / VIEW.width) * widthPct;
    const topPct = CENTER_Y - (b.midY / VIEW.height) * heightPct;
    return { widthPct, heightPct, leftPct, topPct, bounds: b };
  }

  function esc(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function pinName(point, t) {
    return point.id === "kabrt" ? t("point.kabrt.where") : t("point." + point.id + ".name");
  }

  function mount(stage, flags, state) {
    const country = state.country;
    const cam = cameraFor(country);
    stage.classList.toggle("is-country-ch", country === "ch");
    stage.classList.toggle("is-country-cz", country === "cz");
    stage.style.width = cam.widthPct.toFixed(2) + "%";
    stage.style.left = cam.leftPct.toFixed(2) + "%";
    stage.style.top = cam.topPct.toFixed(2) + "%";
    const pickedId = state.pickedId;
    const t = state.t;
    const labels = COUNTRIES.filter((entry) => entry.interactive && entry.label).map((entry) => {
      const y = entry.label[1] + (entry.id === "ch" ? 18 : entry.id === "cz" ? 34 : 0);
      const x = entry.label[0] + (entry.id === "ch" ? 48 : 0);
      const classes = "land-label" + (entry.id === "ch" ? " land-label-ch" : "");
      return '<text class="' + classes + (entry.id === country ? " is-on" : "") + '" x="' + x + '" y="' + y + '" text-anchor="middle">' + esc(t("map.country." + entry.id)) + "</text>";
    }).join("");
    const cities = CITIES.map((city) => {
      const pos = project(city.lat, city.lng);
      const anchor = city.side === "left" ? "end" : city.side === "right" ? "start" : "middle";
      const dx = city.dx != null ? city.dx : city.side === "left" ? -7 : city.side === "right" ? 7 : 0;
      const dy = city.side === "above" ? -8 : city.side === "below" ? 14 : 3;
      return '<g class="city city-' + city.country + '"><circle cx="' + pos.x.toFixed(1) + '" cy="' + pos.y.toFixed(1) + '" r="2.2"></circle><text x="' + (pos.x + dx).toFixed(1) + '" y="' + (pos.y + dy).toFixed(1) + '" text-anchor="' + anchor + '">' + esc(city.name) + "</text></g>";
    }).join("");
    const pins = state.points.map((point) => {
      const pos = project(point.lat, point.lng);
      const classes = ["pin", "pin-" + (PIN_SIDE[point.id] || "above")];
      if (point.country !== country) classes.push("is-dim");
      if (point.id === pickedId) classes.push("is-picked");
      const name = pinName(point, t);
      return '<button type="button" class="' + classes.join(" ") + '" data-point="' + point.id + '" style="left:' + (pos.x / VIEW.width * 100).toFixed(2) + "%;top:" + (pos.y / VIEW.height * 100).toFixed(2) + '%" aria-label="' + esc(name) + '"' + (point.id === pickedId ? ' aria-current="true"' : "") + '><span class="pin-dot"></span><span class="pin-name">' + esc(name) + "</span></button>";
    }).join("");
    stage.innerHTML =
      '<svg viewBox="0 0 ' + VIEW.width + " " + VIEW.height + '" role="img" aria-label="' + esc(t("map.title")) + '">' +
        '<defs>' +
          '<radialGradient id="cheese-melt" cx="46%" cy="38%" r="68%">' +
            '<stop offset="0%" stop-color="#fff6c4"/>' +
            '<stop offset="36%" stop-color="#ffc247"/>' +
            '<stop offset="72%" stop-color="#ef8422"/>' +
            '<stop offset="100%" stop-color="#c25812"/>' +
          "</radialGradient>" +
          '<linearGradient id="fade-left" x1="0" y1="0" x2="170" y2="0" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0" stop-color="#000"/>' +
            '<stop offset="0.35" stop-color="#000"/>' +
            '<stop offset="1" stop-color="#fff"/>' +
          "</linearGradient>" +
          '<linearGradient id="fade-right" x1="940" y1="0" x2="1040" y2="0" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0" stop-color="#fff"/>' +
            '<stop offset="0.7" stop-color="#000"/>' +
            '<stop offset="1" stop-color="#000"/>' +
          "</linearGradient>" +
          '<linearGradient id="fade-top" x1="0" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0" stop-color="#000"/>' +
            '<stop offset="0.3" stop-color="#000"/>' +
            '<stop offset="1" stop-color="#fff"/>' +
          "</linearGradient>" +
          '<linearGradient id="fade-bottom" x1="0" y1="640" x2="0" y2="720" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0" stop-color="#fff"/>' +
            '<stop offset="0.7" stop-color="#000"/>' +
            '<stop offset="1" stop-color="#000"/>' +
          "</linearGradient>" +
          '<mask id="map-fade" maskUnits="userSpaceOnUse">' +
            '<rect width="1040" height="720" fill="#fff"/>' +
            '<rect width="170" height="720" fill="url(#fade-left)"/>' +
            '<rect x="940" width="100" height="720" fill="url(#fade-right)"/>' +
            '<rect width="1040" height="60" fill="url(#fade-top)"/>' +
            '<rect y="640" width="1040" height="80" fill="url(#fade-bottom)"/>' +
          "</mask>" +
        "</defs>" +
        '<g class="lands" mask="url(#map-fade)">' +
          COUNTRIES.filter((entry) => entry.id !== country).map((entry) => {
            const classes = ["land", "land-" + entry.id];
            if (entry.interactive) classes.push("is-button");
            const button = entry.interactive
              ? ' data-country="' + entry.id + '" role="button" tabindex="0" aria-pressed="false" aria-label="' + esc(t("map.flag", { name: t("map.country." + entry.id), count: String(state.count(entry.id)) })) + '"'
              : ' aria-hidden="true"';
            return '<path class="' + classes.join(" ") + '" fill-rule="evenodd" d="' + entry.d + '"' + button + "></path>";
          }).join("") +
        "</g>" +
        '<g class="lands-active">' +
          COUNTRIES.filter((entry) => entry.id === country).map((entry) => {
            const classes = ["land", "land-" + entry.id, "is-on"];
            if (entry.interactive) classes.push("is-button");
            const button = entry.interactive
              ? ' data-country="' + entry.id + '" role="button" tabindex="0" aria-pressed="true" aria-label="' + esc(t("map.flag", { name: t("map.country." + entry.id), count: String(state.count(entry.id)) })) + '"'
              : ' aria-hidden="true"';
            return '<path class="' + classes.join(" ") + '" fill-rule="evenodd" d="' + entry.d + '"' + button + "></path>";
          }).join("") +
        "</g>" +
        '<g class="cities" aria-hidden="true">' + cities + "</g>" +
        '<g aria-hidden="true">' + labels + "</g></svg>" + pins;
    flags.setAttribute("role", "group");
    flags.setAttribute("aria-label", t("map.flags"));
    flags.innerHTML = state.order.map((id) => {
      const name = t("map.country." + id);
      const count = state.count(id);
      const on = id === country;
      return '<button type="button" class="flag-btn' + (on ? " is-on" : "") + '" data-country="' + id + '" aria-pressed="' + (on ? "true" : "false") + '" aria-label="' + esc(t("map.flag", { name, count: String(count) })) + '">' +
        '<span class="flag-cloth">' + FLAGS[id] + '</span><span class="flag-name">' + esc(name) + '</span><span class="flag-count">' + count + "</span></button>";
    }).join("");
  }

  return { VIEW, COUNTRIES, CITIES, project, countryBounds, cameraFor, mount };
});
