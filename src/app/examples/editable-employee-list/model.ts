import { faker } from '@faker-js/faker';

export enum Department {
  PRODUCT = 'Product',
  SALES = 'Sales',
  MARKETING = 'Marketing',
}

export interface Employee {
  name: string;
  email: string;
  hireDate: Date;
  department: Department;
  salary: number;
  active: boolean;
}

export function generateEmployees(count: number): Employee[] {
  const results: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const name = `${firstName} ${lastName}`;
    const email = `${firstName}.${lastName}@company.com`.toLowerCase();
    const hireDate = faker.date.past(10);
    const department = faker.helpers.arrayElement([
      Department.PRODUCT,
      Department.SALES,
      Department.MARKETING,
    ]);
    const salary = faker.datatype.number({ min: 50000, max: 100000 });
    const active = faker.datatype.boolean();
    results.push({
      name,
      email,
      hireDate,
      department,
      salary,
      active,
    });
  }

  return results;
}
