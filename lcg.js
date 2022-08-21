const lcg_m = 0x10001;
const lcg_a = 75;
const lcg_c = 74;

function lcg(seed){
    return (lcg_a * seed + lcg_c) % lcg_m; 
}