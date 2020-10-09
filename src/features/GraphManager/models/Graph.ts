import { Dictionary } from "../../../common/helpers/lang";

export interface Graph extends Dictionary<GraphElement> {

}

export interface GraphElement {
    neighbors: Node[];
    neighborsVisited: number;
}

export interface Node {
    key: string;
    cost: number;
}