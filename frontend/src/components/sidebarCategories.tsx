import { Spinner, Alert, ListGroup } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetCategoryFamilyQuery } from "../reducers/apiReducer";
import { BaseCategoryHook } from "../hooks";
import type { CategoryToReturn } from "../types";

interface SidebarCategoriesProps {
  onChange: (value: string) => void;
}

const SidebarCategories = ({ onChange }: SidebarCategoriesProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [curentLineage, setCurentCategoryLineage] = useState<
    Array<CategoryToReturn> | undefined
  >(undefined);

  const categoryy = searchParams.get("category");

  const { baseCatFam, baseCatFamLoading, baseCatFamError } = BaseCategoryHook();

  const {
    data: currentCategoryFamily,
    error,
    isLoading,
  } = useGetCategoryFamilyQuery(categoryy || undefined);

  useEffect(() => {
    if (currentCategoryFamily) {
      setCurentCategoryLineage(
        currentCategoryFamily.lineage.concat(currentCategoryFamily.category)
      );
    } else {
      setCurentCategoryLineage(undefined);
    }
  }, [searchParams, currentCategoryFamily]);

  if (error || baseCatFamError) {
    return (
      <Alert variant="danger">
        error occured when getting categories, try again later.
      </Alert>
    );
  }

  if (isLoading || baseCatFamLoading) {
    return <Spinner animation="border" />;
  }

  const setCurrentCategory = (id: string | null) => {
    if (id !== null) {
      searchParams.set("category", id);
    }
    if (id === "") {
      searchParams.delete("category");
    }
    onChange(id as string);
    navigate(`/products?${searchParams.toString()}`);
  };

  return (
    <ListGroup onSelect={(categg) => setCurrentCategory(categg)}>
      <ListGroup.Item eventKey={""} key={"allcatselect"}>
        All Categories
      </ListGroup.Item>
      {baseCatFam && currentCategoryFamily ? (
        baseCatFam.imediateChildren.map((baseCat) => {
          if (
            curentLineage &&
            curentLineage[0] &&
            baseCat.id === curentLineage[0].id
          ) {
            const temp1 = curentLineage.map((e) => (
              <ListGroup.Item eventKey={e.id} key={e.id + "activ"}>
                {">"}
                {e.name}
              </ListGroup.Item>
            ));

            const temp2 = currentCategoryFamily.imediateChildren.map((e) => (
              <ListGroup.Item eventKey={e.id} key={e.id + "children"}>
                {e.name}
              </ListGroup.Item>
            ));

            return temp1.concat(temp2);
          } else {
            return (
              <ListGroup.Item
                eventKey={baseCat.id}
                key={baseCat.id + "inactive"}
              >
                {baseCat.name}
              </ListGroup.Item>
            );
          }
        })
      ) : (
        <Spinner animation="border" />
      )}
    </ListGroup>
  );
};

export default SidebarCategories;
