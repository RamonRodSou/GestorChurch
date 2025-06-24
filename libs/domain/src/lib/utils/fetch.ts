import { Financial } from "@domain/financial";
import { GroupSummary } from "@domain/group";
import { ChildSummary, MemberSummary } from "@domain/user";
import { findAllChildrensSummary } from "@service/ChildrenService";
import { findAllFinancials } from "@service/FinancialService";
import { findAllGroupsSummary } from "@service/GroupService";
import { findAllMembersSummary } from "@service/MemberService";
import React from "react";

export async function fetchMembersSummary(setData: React.Dispatch<React.SetStateAction<MemberSummary[]>>): Promise<void> {
    const response = await findAllMembersSummary();
    setData(response);
};

export async function fetchChildrensSummary(setData: React.Dispatch<React.SetStateAction<ChildSummary[]>>): Promise<void> {
    const response = await findAllChildrensSummary();
    setData(response);
};

export async function fetchGroupsSummary(setData: React.Dispatch<React.SetStateAction<GroupSummary[]>>): Promise<void> {
    const response = await findAllGroupsSummary();
    setData(response)
};

export async function fetchFinancial(): Promise<Financial[]> {
    const response = await findAllFinancials();
    return response;
};