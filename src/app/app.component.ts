import { Component } from '@angular/core';
import data from './data';

export interface TreeNodeInterface {
  key: number;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  isCollapsed = false;


  formateData (data: {[key:string]:any}) : TreeNodeInterface[]  {
    const [ tree1Name, tree1Child ] = [ 'optype', 'opTypeDetails'];
    const [ tree2Name, tree2Child ] = ['rootcategoryname', 'details'];
    const [ tree3Name ] = ['absname'];

    const origin = data['optypedeta'];

    function deal(item: any, key: number): TreeNodeInterface {
      if(item[tree1Name]) {
        item['name'] = item[tree1Name];
        item['children'] = item[tree1Child] || [];
        item['key'] = key;
        item['children'].map((child, key_2) => {
          if(child[tree2Name]) {
            child['name'] = child[tree2Name];
            child['key'] = key + '' + key_2;
            child['children'] = child[tree2Child] || [];
            child['children'].map((c, key_3) => {
              if(c[tree3Name]) {
                c['name'] = c[tree3Name];
                c['key'] = key + '' + key_2 + key_3;
              }
            })
          }
        })
        return item;
      }
    }

    return origin.map((tree, index) => {
      return deal(tree, (index+1));
    })
  }

  listOfMapData: TreeNodeInterface[] = this.formateData(data);

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }


}
