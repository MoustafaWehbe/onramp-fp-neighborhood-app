"use strict";

const neighborhoods = [
  { name: "Hamra", city: "Beirut" },
  { name: "Achrafieh", city: "Beirut" },
  { name: "Bourj Hammoud", city: "Beirut" },
  { name: "Verdun", city: "Beirut" },
  { name: "Dekwaneh", city: "Beirut" },
  { name: "Jounieh", city: "Jounieh" },
  { name: "Tyre", city: "Tyre" },
];

const categories = [
  {
    name: "Roads",
    description: "Potholes, pavement damage, and road surface issues.",
    department: "Public Works",
  },
  {
    name: "Lighting",
    description: "Broken or missing streetlights and public lighting.",
    department: "Électricité du Liban",
  },
  {
    name: "Utilities",
    description: "Water pipes, leaks, and other utility issues.",
    department: "Water Authority",
  },
  {
    name: "Sanitation",
    description: "Overflowing dumpsters, waste collection, and litter.",
    department: "Waste Management",
  },
  {
    name: "Parks",
    description: "Damaged benches, paths, and green space upkeep.",
    department: "Parks & Recreation",
  },
  {
    name: "Noise",
    description: "Construction noise and other noise ordinance issues.",
    department: "Code Enforcement",
  },
  {
    name: "Safety",
    description: "Public safety hazards and concerns.",
    department: "Community Safety",
  },
];

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "neighborhoods",
      neighborhoods.map((n) => ({
        name: n.name,
        slug: slugify(n.name),
        city: n.city,
        created_at: now,
        updated_at: now,
      }))
    );

    await queryInterface.bulkInsert(
      "categories",
      categories.map((c) => ({
        name: c.name,
        slug: slugify(c.name),
        description: c.description,
        department: c.department,
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("neighborhoods", {
      slug: neighborhoods.map((n) => slugify(n.name)),
    });
    await queryInterface.bulkDelete("categories", {
      slug: categories.map((c) => slugify(c.name)),
    });
  },
};
