import { Component } from '@angular/core';
import { Metrics } from '../metrics';
import { NotificationService } from 'src/app/binary-tree-container/service/notification.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent {
  sortModes: string[] = [
    'Quick Sort',
    'Bubble Sort',
    'Merge Sort',
    'Insertion Sort',
    'Selection Sort',
  ];

  files: string[] = [
    'num.1000.1.in',
    'num.1000.2.in',
    'num.1000.3.in',
    'num.1000.4.in',
    'num.10000.1.in',
    'num.10000.2.in',
    'num.10000.3.in',
    'num.10000.4.in',
    'num.100000.1.in',
    'num.100000.2.in',
    'num.100000.3.in',
    'num.100000.4.in',
  ];

  arr: any;
  srcResult: any;
  fileName!: string;

  metrics!: Metrics;
  metricsArr: Metrics[] = [];

  sortMode: string = 'Merge Sort';

  constructor(private notificationService: NotificationService) {}
  updateDelay() {}

  changeSortMode(mode: string) {
    this.sortMode = mode;
  }

  changeFile(file: string) {
    this.fileName = file;
  }

  sort() {
    this.metricsArr = [];
    let arrCopy = this.arr.slice(0);

    let start = performance.now();
    arrCopy = this.mergeSort(arrCopy);
    console.log(`Merge sort: ${arrCopy}`);
    let end = performance.now();
    let timeTaken = end - start;

    this.metrics = {
      sorting: 'Merge Sort',
      fileName: this.fileName,
      time: `${timeTaken} ms`,
      arr: [arrCopy[0], '...', arrCopy[arrCopy.length - 1]],
    };
    this.metricsArr.push(this.metrics);

    arrCopy = this.arr.slice(0);
    this.metrics = this.selectionSort(arrCopy);
    this.metricsArr.push(this.metrics);

    arrCopy = this.arr.slice(0);
    this.metrics = this.insertionSort(arrCopy);
    this.metricsArr.push(this.metrics);
  }

  bubbleSort(arr: number[]): Metrics {
    const start = performance.now();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    const end = performance.now();
    const timeTaken = end - start;
    const metrics: Metrics = {
      sorting: 'Bubble Sort',
      fileName: this.fileName,
      time: `${timeTaken} ms`,
      arr: [arr[0], '...', arr[arr.length - 1]],
    };
    return metrics;
  }

  // Quick Sort
  quickSort(arr: number[]): Metrics {
    const start = performance.now();

    if (arr.length <= 1) {
      const end = performance.now();
      const timeTaken = end - start;

      const metrics: Metrics = {
        sorting: 'Quick Sort',
        fileName: this.fileName,
        time: `${timeTaken} ms`,
        arr: arr.length > 0 ? [arr[0], '...', arr[arr.length - 1]] : [],
      };
      return metrics;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    const leftMetrics = this.quickSort([...left]);
    const rightMetrics = this.quickSort([...right]);

    const sortedArray = leftMetrics.arr.concat(pivot, rightMetrics.arr);

    const firstElement = sortedArray.length > 0 ? sortedArray[0] : undefined;
    const lastElement =
      sortedArray.length > 0 ? sortedArray[sortedArray.length - 1] : undefined;

    const end = performance.now();
    const timeTaken = end - start;
    const metrics: Metrics = {
      sorting: 'Quick Sort',
      fileName: this.fileName,
      time: `${timeTaken} ms`,
      arr: sortedArray.length > 0 ? [firstElement, '...', lastElement] : [],
    };
    return metrics;
  }

  mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) {
      return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return this.mergeArr(this.mergeSort(left), this.mergeSort(right));
  }

  mergeArr(left: number[], right: number[]): number[] {
    let result: number[] = [];
    let leftIndex: number = 0;
    let rightIndex: number = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  }

  selectionSort(arr: number[]): Metrics {
    const start = performance.now();
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        // Swap arr[i] and arr[minIndex]
        const temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
      }
    }

    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Selection sort: ${arr}`);
    const metrics: Metrics = {
      sorting: 'Selection Sort',
      fileName: this.fileName,
      time: `${timeTaken} ms`,
      arr: arr.length > 0 ? [arr[0], '...', arr[arr.length - 1]] : [],
    };

    return metrics;
  }

  insertionSort(arr: number[]): Metrics {
    const start = performance.now();
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;
    }

    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Insetion sort: ${arr}`);
    const metrics: Metrics = {
      sorting: 'Insertion Sort',
      fileName: this.fileName,
      time: `${timeTaken} ms`,
      arr: arr.length > 0 ? [arr[0], '...', arr[arr.length - 1]] : [],
    };

    return metrics;
  }

  onFileInput() {
    const inputNode: any = document.querySelector('#file');
    let fileName: any;

    try {
      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const fileContent = e.target.result;
          this.fileName = inputNode.files[0].name;
          this.processFileContent(fileContent);
        };
        reader.readAsText(inputNode.files[0]);
      }
    } catch (e) {
      this.notificationService.notify(
        'An error ocurred trying to load the file'
      );
      console.log(e);
    }
  }

  onFileSelected(file: string) {
    const inputNode: any = document.querySelector('#file');
    let fileName: any;

    try {
      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const fileContent = e.target.result;
          this.fileName = inputNode.files[0].name;
          this.processFileContent(fileContent);
        };
        reader.readAsText(inputNode.files[0]);
      }
    } catch (e) {
      this.notificationService.notify(
        'An error ocurred trying to load the file'
      );
      console.log(e);
    }
  }

  processFileContent(fileContent: string) {
    try {
      const lines = fileContent.split('\n');

      const numbers = lines
        .slice(1)
        .map((line) => parseFloat(line))
        .filter((number) => !isNaN(number));

      this.arr = numbers;
      this.notificationService.notify(`File ${this.fileName} loaded.`);
    } catch (e) {
      this.notificationService.notify(
        'An error ocurred trying to load the file'
      );
      console.log(e);
    }
  }
}
