import { of, fromEvent, merge } from 'rxjs'; 
import { map, startWith } from 'rxjs/operators';

function withList() {
  const width = window.innerWidth;
  const arr = [568, 0, 768, 1, 1024, 2];
  const start = performance.now();
  let size = 0;
  for (let i=0; i <= arr.length; i+=2) {
    if (i > 1 && arr[i] < width && arr[i-2] > width) {
      size = arr[i+1];
    }
  }
  const end = performance.now();
  console.log(`withArr: Total time ${end - start}`);
  return size;
}

function withMapList() {
  const width = window.innerWidth;
  const arr = [
    { 568: 0 }, 
    { 768: 1 }, 
    { 1024: 2} 
  ];

  const start = performance.now();
  let size = 0;
  size = arr.filter(elem => {
    // Also converts to Number
    for(const key in elem){
      if (Number(key) < width) {
        return true;
      }
      return false;
    }
  }).unshift();

  console.log(`size is: ${size}`);
  const end = performance.now();
  console.log(`withMapList: Total time ${end - start}`);

  return size;
}

function withMap() {
  const map = {
	  568: 0,
	  768: 1,
	  1024: 2
	};

  const start = performance.now();
  const width = window.innerWidth;
		const size = Object.keys(map).map(Number)
			.find(key => width < key);
    const end = performance.now();
		console.log(`withMap: Total time ${end - start}`);
    if (!size) {
			return map[1024];
		}

		return map[size];
}


const list = fromEvent(window, "resize").pipe(
  startWith(withList),
  map(() => withList())
);

const withM = fromEvent(window, "resize").pipe(
  startWith(withMap),
  map(() => withMap())
);

const withML = fromEvent(window, "resize").pipe(
  startWith(withMapList),
  map(() => withMapList())
)

merge(list, withM, withML).subscribe();

function triggerResize(times) {

  for (let i = 0; i <= times; i+=1) {
    console.log(`Loop No: ${i}`);
    window.dispatchEvent(new Event("resize"));
  }
}

triggerResize(10);
// withList();