import type { FieldError } from "react-hook-form";
import { Form, Alert, Spinner, Row } from "react-bootstrap";
import { useState } from "react";

import { useGetCategoryFamilyQuery } from "@/redux/categoryEndpoints";
import type { CategoryToReturn, CategoryFamilyObject } from "@/types/category";
interface CategorySelectProps {
  currentCategory: string;
  onChange: (value: string) => void;
  error: FieldError | undefined;
}

interface CategorySelectChildProps {
  onChange?: (value: string) => void;
  lineage?: CategoryFamilyObject;
}

interface CategorySelectLineageProps {
  onChange?: (value: string) => void;
  lineage?: CategoryFamilyObject;
}

export const CategorySelector = ({
  currentCategory = "",
  onChange,
  error,
}: CategorySelectProps) => {
  const {
    data: lineage,
    isError,
    isLoading,
  } = useGetCategoryFamilyQuery(currentCategory);

  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;

  if (isLoading || lineage === undefined) return <Spinner animation="border" />;

  return (
    <div>
      <Form.Label>select category:</Form.Label>
      <Row>
        <div className="d-flex align-items-center">
          <CategorySelectLineage onChange={onChange} lineage={lineage} />
          <CategorySelectChild onChange={onChange} lineage={lineage} />
        </div>
      </Row>
      {error && <Form.Text className="text-danger">{error.message}</Form.Text>}
    </div>
  );
};

const CategorySelectChild = ({
  onChange,
  lineage,
}: CategorySelectChildProps) => {
  const [localCategory, setlocalCategory] = useState<string | undefined>(
    undefined
  );
  const {
    data: lineage2,
    isError,
    isLoading,
  } = useGetCategoryFamilyQuery(localCategory, { skip: !!lineage });

  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;

  if (isLoading) return <Spinner animation="border" />;

  const realLineage = lineage || lineage2;

  const handleSelectCategory = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setlocalCategory(id);
    }
  };

  return (
    <div className="flex-grow-1">
      <Form.Select
        onChange={(e) => handleSelectCategory(e.target.value)}
        defaultValue=""
      >
        <option value="">Select a category</option>
        {realLineage?.imediateChildren.map((child: CategoryToReturn) => (
          <option key={child.id} value={child.id}>
            {child.name}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

const CategorySelectLineage = ({
  onChange,
  lineage,
}: CategorySelectLineageProps) => {
  const [localCategory, setlocalCategory] = useState<string | undefined>(
    undefined
  );
  const {
    data: lineage2,
    isError,
    isLoading,
  } = useGetCategoryFamilyQuery(localCategory, { skip: !!lineage });

  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;

  if (isLoading) return <Spinner animation="border" />;

  const realLineage = lineage || lineage2;

  const handleSelectCategory = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setlocalCategory(id);
    }
  };
  return (
    <div
      className="me-3"
      style={{ whiteSpace: "nowrap" }}
      key="category-select-paragraph"
    >
      <a
        key="category-select-base-paragraph"
        className="pe-auto"
        onClick={() => handleSelectCategory("")}
      >
        /{" "}
      </a>
      {realLineage?.lineage.map((parent) => {
        return (
          <span key={`${parent.id}parent`}>
            <a
              className="pe-auto"
              onClick={() => handleSelectCategory(parent.id)}
            >
              {parent.name}{" "}
            </a>
            {" /"}
          </span>
        );
      })}
      {realLineage && realLineage.category[0] ? (
        <a key={`${realLineage.category[0].id}parent`}>
          {realLineage.category[0].name}
        </a>
      ) : (
        <a></a>
      )}
    </div>
  );
};
