import { CheckboxItem } from './../components/CheckboxList';
import { v4 as uuidv4 } from 'uuid';

// Number of preferences to be used for each clustering analysis.
export const clusteringSize = 2;

// Cluster type for kmeans center values
export type Cluster = {
  name: string;
  values: Record<string, number>;
};

export type ClusterCheckboxItem = CheckboxItem & Cluster;

export type ClusterList = {
  name: "clusterList";
  list: ClusterCheckboxItem[];
};

// Cluster center values for Testing!!!!!!!!!
export const clusterLists: ClusterList[] = [
  {
    name: "clusterList",
    list: [
      {
        name: "cluster1",
        values: {
          "physical health not good for >=14 days": 0.172175392,
          "mental health not good for >=14 days": 0.202563458,
          "no leisure-time physical activity": 0.195023223,
          "binge drinking": 0.578926022,
          "sleeping less than 7 hours": 0.254194234,
          "current smoking": 0.190094986,
          "current lack of health insurance": 0.115390974,
          "visits to dentist or dental clinic": 0.730251072,
          "visits to doctor for routine checkup": 0.515289059,
          "unserved medicaid enrollees / km2": 0.0476632056,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster2",
        values: {
          "physical health not good for >=14 days": 0.24023542,
          "mental health not good for >=14 days": 0.28706891,
          "no leisure-time physical activity": 0.332894342,
          "binge drinking": 0.430991112,
          "sleeping less than 7 hours": 0.708170493,
          "current smoking": 0.270725782,
          "current lack of health insurance": 0.15446234,
          "visits to dentist or dental clinic": 0.584269663,
          "visits to doctor for routine checkup": 0.776916903,
          "unserved medicaid enrollees / km2": 0.0615815607,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster3",
        values: {
          "physical health not good for >=14 days": 0.573639456,
          "mental health not good for >=14 days": 0.560308285,
          "no leisure-time physical activity": 0.676582591,
          "binge drinking": 0.367039801,
          "sleeping less than 7 hours": 0.629664855,
          "current smoking": 0.575337838,
          "current lack of health insurance": 0.562040558,
          "visits to dentist or dental clinic": 0.259663537,
          "visits to doctor for routine checkup": 0.49514652,
          "unserved medicaid enrollees / km2": 0.254005292,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster4",
        values: {
          "physical health not good for >=14 days": 0.306538942,
          "mental health not good for >=14 days": 0.341659785,
          "no leisure-time physical activity": 0.434415309,
          "binge drinking": 0.514696924,
          "sleeping less than 7 hours": 0.424245785,
          "current smoking": 0.331770546,
          "current lack of health insurance": 0.364766819,
          "visits to dentist or dental clinic": 0.466094184,
          "visits to doctor for routine checkup": 0.408051133,
          "unserved medicaid enrollees / km2": 0.14429812,
        },
        checked: true,
        id: uuidv4(),
      },
    ]
  },
  {
    name: "clusterList",
    list: [
      {
        name: "cluster1",
        values: {
          "physical health not good for >=14 days": 0.172175392,
          "mental health not good for >=14 days": 0.202563458,
          "no leisure-time physical activity": 0.195023223,
          "binge drinking": 0.578926022,
          "sleeping less than 7 hours": 0.254194234,
          "current smoking": 0.190094986,
          "current lack of health insurance": 0.115390974,
          "visits to dentist or dental clinic": 0.730251072,
          "visits to doctor for routine checkup": 0.515289059,
          "unserved medicaid enrollees / km2": 0.0476632056,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster2",
        values: {
          "physical health not good for >=14 days": 0.24023542,
          "mental health not good for >=14 days": 0.28706891,
          "no leisure-time physical activity": 0.332894342,
          "binge drinking": 0.430991112,
          "sleeping less than 7 hours": 0.708170493,
          "current smoking": 0.270725782,
          "current lack of health insurance": 0.15446234,
          "visits to dentist or dental clinic": 0.584269663,
          "visits to doctor for routine checkup": 0.776916903,
          "unserved medicaid enrollees / km2": 0.0615815607,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster3",
        values: {
          "physical health not good for >=14 days": 0.573639456,
          "mental health not good for >=14 days": 0.560308285,
          "no leisure-time physical activity": 0.676582591,
          "binge drinking": 0.367039801,
          "sleeping less than 7 hours": 0.629664855,
          "current smoking": 0.575337838,
          "current lack of health insurance": 0.562040558,
          "visits to dentist or dental clinic": 0.259663537,
          "visits to doctor for routine checkup": 0.49514652,
          "unserved medicaid enrollees / km2": 0.254005292,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster4",
        values: {
          "physical health not good for >=14 days": 0.306538942,
          "mental health not good for >=14 days": 0.341659785,
          "no leisure-time physical activity": 0.434415309,
          "binge drinking": 0.514696924,
          "sleeping less than 7 hours": 0.424245785,
          "current smoking": 0.331770546,
          "current lack of health insurance": 0.364766819,
          "visits to dentist or dental clinic": 0.466094184,
          "visits to doctor for routine checkup": 0.408051133,
          "unserved medicaid enrollees / km2": 0.14429812,
        },
        checked: true,
        id: uuidv4(),
      },
    ]
  },
  {
    name: "clusterList",
    list: [
      {
        name: "cluster1",
        values: {
          "physical health not good for >=14 days": 0.172175392,
          "mental health not good for >=14 days": 0.202563458,
          "no leisure-time physical activity": 0.195023223,
          "binge drinking": 0.578926022,
          "sleeping less than 7 hours": 0.254194234,
          "current smoking": 0.190094986,
          "current lack of health insurance": 0.115390974,
          "visits to dentist or dental clinic": 0.730251072,
          "visits to doctor for routine checkup": 0.515289059,
          "unserved medicaid enrollees / km2": 0.0476632056,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster2",
        values: {
          "physical health not good for >=14 days": 0.24023542,
          "mental health not good for >=14 days": 0.28706891,
          "no leisure-time physical activity": 0.332894342,
          "binge drinking": 0.430991112,
          "sleeping less than 7 hours": 0.708170493,
          "current smoking": 0.270725782,
          "current lack of health insurance": 0.15446234,
          "visits to dentist or dental clinic": 0.584269663,
          "visits to doctor for routine checkup": 0.776916903,
          "unserved medicaid enrollees / km2": 0.0615815607,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster3",
        values: {
          "physical health not good for >=14 days": 0.573639456,
          "mental health not good for >=14 days": 0.560308285,
          "no leisure-time physical activity": 0.676582591,
          "binge drinking": 0.367039801,
          "sleeping less than 7 hours": 0.629664855,
          "current smoking": 0.575337838,
          "current lack of health insurance": 0.562040558,
          "visits to dentist or dental clinic": 0.259663537,
          "visits to doctor for routine checkup": 0.49514652,
          "unserved medicaid enrollees / km2": 0.254005292,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster4",
        values: {
          "physical health not good for >=14 days": 0.306538942,
          "mental health not good for >=14 days": 0.341659785,
          "no leisure-time physical activity": 0.434415309,
          "binge drinking": 0.514696924,
          "sleeping less than 7 hours": 0.424245785,
          "current smoking": 0.331770546,
          "current lack of health insurance": 0.364766819,
          "visits to dentist or dental clinic": 0.466094184,
          "visits to doctor for routine checkup": 0.408051133,
          "unserved medicaid enrollees / km2": 0.14429812,
        },
        checked: true,
        id: uuidv4(),
      },
    ]
  }
]
